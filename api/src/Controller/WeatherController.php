<?php

namespace App\Controller;

use App\Entity\Intervention;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\Routing\Attribute\Route;

class WeatherController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('/api/weather/forecast/{interventionId}', name: 'weather_forecast', methods: ['GET'])]
    public function forecast(int $interventionId): JsonResponse
    {
        $intervention = $this->entityManager->getRepository(Intervention::class)->find($interventionId);

        if (!$intervention) {
            throw new NotFoundHttpException('Intervention not found');
        }

        // Mock weather data - in production, this would call a real weather API
        $forecast = [];
        $baseDate = $intervention->getDate() ?? new \DateTime();

        for ($i = 0; $i < 5; $i++) {
            $date = clone $baseDate;
            $date->modify("+{$i} days");

            $forecast[] = [
                'day' => $date->format('l'),
                'date' => $date->format('Y-m-d'),
                'temperature' => rand(15, 25),
                'rainProbability' => rand(0, 100),
                'condition' => ['Ensoleillé', 'Nuageux', 'Partiellement nuageux', 'Pluvieux'][rand(0, 3)],
            ];
        }

        return new JsonResponse([
            'interventionId' => $interventionId,
            'location' => $intervention->getLocation(),
            'forecast' => $forecast,
        ]);
    }

    #[Route('/api/weather/alerts', name: 'weather_alerts', methods: ['GET'])]
    public function alerts(): JsonResponse
    {
        $interventionRepo = $this->entityManager->getRepository(Intervention::class);

        // Get interventions with high rain probability
        $riskyInterventions = $interventionRepo->createQueryBuilder('i')
            ->where('i.rainProbability > 50')
            ->andWhere('i.date >= :today')
            ->andWhere('i.status NOT IN (:excludedStatuses)')
            ->setParameter('today', new \DateTime('today'))
            ->setParameter('excludedStatuses', [Intervention::STATUS_TERMINEE, Intervention::STATUS_ANNULEE])
            ->orderBy('i.date', 'ASC')
            ->getQuery()
            ->getResult();

        $alerts = [];
        foreach ($riskyInterventions as $intervention) {
            $alerts[] = [
                'interventionId' => $intervention->getId(),
                'title' => $intervention->getTitle(),
                'date' => $intervention->getDate()->format('Y-m-d'),
                'location' => $intervention->getLocation(),
                'rainProbability' => $intervention->getRainProbability(),
            ];
        }

        return new JsonResponse([
            'count' => count($alerts),
            'alerts' => $alerts,
        ]);
    }

    #[Route('/api/weather/location/{lat},{lng}', name: 'weather_location', methods: ['GET'])]
    public function location(float $lat, float $lng): JsonResponse
    {
        // Mock weather data - in production, this would call a real weather API
        return new JsonResponse([
            'latitude' => $lat,
            'longitude' => $lng,
            'current' => [
                'temperature' => rand(15, 25),
                'humidity' => rand(40, 80),
                'condition' => ['Ensoleillé', 'Nuageux', 'Partiellement nuageux', 'Pluvieux'][rand(0, 3)],
                'windSpeed' => rand(5, 30),
            ],
            'forecast' => array_map(function ($i) {
                $date = new \DateTime("+{$i} days");
                return [
                    'day' => $date->format('l'),
                    'date' => $date->format('Y-m-d'),
                    'temperature' => rand(15, 25),
                    'rainProbability' => rand(0, 100),
                    'condition' => ['Ensoleillé', 'Nuageux', 'Partiellement nuageux', 'Pluvieux'][rand(0, 3)],
                ];
            }, range(0, 4)),
        ]);
    }
}
