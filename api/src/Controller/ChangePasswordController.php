<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsController]
class ChangePasswordController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        // In production, get the actual authenticated user
        $user = $this->entityManager->getRepository(User::class)->findOneBy([]);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        $payload = json_decode($request->getContent(), true);

        if (!isset($payload['currentPassword']) || !isset($payload['newPassword'])) {
            return new JsonResponse([
                'error' => 'Both currentPassword and newPassword are required',
            ], 400);
        }

        // Verify current password
        if (!$this->passwordHasher->isPasswordValid($user, $payload['currentPassword'])) {
            return new JsonResponse([
                'error' => 'Current password is incorrect',
            ], 400);
        }

        // Hash and set new password
        $hashedPassword = $this->passwordHasher->hashPassword($user, $payload['newPassword']);
        $user->setPassword($hashedPassword);

        $this->entityManager->flush();

        return new JsonResponse([
            'message' => 'Password changed successfully',
        ]);
    }
}
