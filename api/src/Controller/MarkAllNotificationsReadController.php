<?php

namespace App\Controller;

use App\Entity\Notification;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class MarkAllNotificationsReadController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke(): JsonResponse
    {
        // In production, filter by authenticated user
        $this->entityManager->createQueryBuilder()
            ->update(Notification::class, 'n')
            ->set('n.read', ':read')
            ->setParameter('read', true)
            ->getQuery()
            ->execute();

        return new JsonResponse([
            'message' => 'All notifications marked as read',
        ]);
    }
}
