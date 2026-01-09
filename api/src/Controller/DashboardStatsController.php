<?php

namespace App\Controller;

use App\Entity\Intervention;
use App\Entity\Technician;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class DashboardStatsController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    #[Route('/api/dashboard/stats', name: 'dashboard_stats', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        $interventionRepo = $this->entityManager->getRepository(Intervention::class);
        $technicianRepo = $this->entityManager->getRepository(Technician::class);

        $startOfWeek = new \DateTime('monday this week');
        $endOfWeek = new \DateTime('sunday this week 23:59:59');

        // Interventions this week
        $interventionsThisWeek = $interventionRepo->createQueryBuilder('i')
            ->select('COUNT(i.id)')
            ->where('i.date BETWEEN :start AND :end')
            ->setParameter('start', $startOfWeek)
            ->setParameter('end', $endOfWeek)
            ->getQuery()
            ->getSingleScalarResult();

        // Weather risk interventions (rain probability > 50%)
        $weatherRiskInterventions = $interventionRepo->createQueryBuilder('i')
            ->select('COUNT(i.id)')
            ->where('i.rainProbability > 50')
            ->andWhere('i.date >= :today')
            ->andWhere('i.status NOT IN (:excludedStatuses)')
            ->setParameter('today', new \DateTime('today'))
            ->setParameter('excludedStatuses', [Intervention::STATUS_TERMINEE, Intervention::STATUS_ANNULEE])
            ->getQuery()
            ->getSingleScalarResult();

        // Confirmed interventions
        $confirmedInterventions = $interventionRepo->createQueryBuilder('i')
            ->select('COUNT(i.id)')
            ->where('i.status = :status')
            ->setParameter('status', Intervention::STATUS_CONFIRMEE)
            ->getQuery()
            ->getSingleScalarResult();

        // Active technicians
        $activeTechnicians = $technicianRepo->createQueryBuilder('t')
            ->select('COUNT(t.id)')
            ->where('t.status = :status')
            ->setParameter('status', 'Actif')
            ->getQuery()
            ->getSingleScalarResult();

        return new JsonResponse([
            'interventionsThisWeek' => (int) $interventionsThisWeek,
            'weatherRiskInterventions' => (int) $weatherRiskInterventions,
            'confirmedInterventions' => (int) $confirmedInterventions,
            'activeTechnicians' => (int) $activeTechnicians,
        ]);
    }
}
