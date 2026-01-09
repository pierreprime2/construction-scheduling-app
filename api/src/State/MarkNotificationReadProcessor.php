<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Notification;
use Doctrine\ORM\EntityManagerInterface;

class MarkNotificationReadProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): Notification
    {
        $data->setRead(true);
        $this->entityManager->flush();

        return $data;
    }
}
