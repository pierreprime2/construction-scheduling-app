<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Intervention;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;

class RescheduleInterventionProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private RequestStack $requestStack,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Intervention
    {
        $request = $this->requestStack->getCurrentRequest();
        $payload = json_decode($request->getContent(), true);

        if (isset($payload['date'])) {
            $data->setDate(new \DateTime($payload['date']));
        }

        if (isset($payload['time'])) {
            $data->setTime(new \DateTime($payload['time']));
        }

        $this->entityManager->flush();

        return $data;
    }
}
