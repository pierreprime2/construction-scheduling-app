<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class UserProfileController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function __invoke(Request $request): JsonResponse
    {
        // In production, get the actual authenticated user
        // For now, return mock data or first user
        $user = $this->entityManager->getRepository(User::class)->findOneBy([]);

        if ($request->isMethod('GET')) {
            if (!$user) {
                return new JsonResponse([
                    'id' => 1,
                    'email' => 'demo@example.com',
                    'firstName' => 'Demo',
                    'lastName' => 'User',
                    'phone' => '+33 1 23 45 67 89',
                    'weatherPreferences' => [
                        'rainAlertThreshold' => 50,
                        'geographicZone' => 'Île-de-France',
                    ],
                    'notificationPreferences' => [
                        'weatherAlerts' => true,
                        'interventionReminders' => true,
                        'emailNotifications' => true,
                    ],
                ]);
            }

            return new JsonResponse([
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstName' => $user->getFirstName(),
                'lastName' => $user->getLastName(),
                'phone' => $user->getPhone(),
                'weatherPreferences' => $user->getWeatherPreferences(),
                'notificationPreferences' => $user->getNotificationPreferences(),
            ]);
        }

        // PUT - Update profile
        $payload = json_decode($request->getContent(), true);

        if (!$user) {
            return new JsonResponse(['error' => 'User not found'], 404);
        }

        if (isset($payload['firstName'])) {
            $user->setFirstName($payload['firstName']);
        }
        if (isset($payload['lastName'])) {
            $user->setLastName($payload['lastName']);
        }
        if (isset($payload['email'])) {
            $user->setEmail($payload['email']);
        }
        if (isset($payload['phone'])) {
            $user->setPhone($payload['phone']);
        }

        $this->entityManager->flush();

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstName' => $user->getFirstName(),
            'lastName' => $user->getLastName(),
            'phone' => $user->getPhone(),
        ]);
    }
}
