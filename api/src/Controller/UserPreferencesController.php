<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Attribute\AsController;

#[AsController]
class UserPreferencesController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $entityManager,
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
        $uri = $request->getRequestUri();

        if (str_contains($uri, 'weather')) {
            $prefs = $user->getWeatherPreferences();

            if (isset($payload['rainAlertThreshold'])) {
                $prefs['rainAlertThreshold'] = (int) $payload['rainAlertThreshold'];
            }
            if (isset($payload['geographicZone'])) {
                $prefs['geographicZone'] = $payload['geographicZone'];
            }

            $user->setWeatherPreferences($prefs);
            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Weather preferences updated',
                'preferences' => $prefs,
            ]);
        }

        if (str_contains($uri, 'notifications')) {
            $prefs = $user->getNotificationPreferences();

            if (isset($payload['weatherAlerts'])) {
                $prefs['weatherAlerts'] = (bool) $payload['weatherAlerts'];
            }
            if (isset($payload['interventionReminders'])) {
                $prefs['interventionReminders'] = (bool) $payload['interventionReminders'];
            }
            if (isset($payload['emailNotifications'])) {
                $prefs['emailNotifications'] = (bool) $payload['emailNotifications'];
            }

            $user->setNotificationPreferences($prefs);
            $this->entityManager->flush();

            return new JsonResponse([
                'message' => 'Notification preferences updated',
                'preferences' => $prefs,
            ]);
        }

        return new JsonResponse(['error' => 'Unknown preference type'], 400);
    }
}
