<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\OpenApi\Model\Operation;
use App\Controller\UserProfileController;
use App\Controller\ChangePasswordController;
use App\Controller\UserPreferencesController;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: '`user`')]
#[ORM\UniqueConstraint(name: 'UNIQ_USER_EMAIL', fields: ['email'])]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Put(),
        new Delete(),
        new Get(
            uriTemplate: '/user/profile',
            controller: UserProfileController::class,
            name: 'get_profile',
            openapi: new Operation(
                summary: 'Récupérer le profil utilisateur',
                description: 'Retourne le profil de l\'utilisateur connecté',
            ),
            read: false,
        ),
        new Put(
            uriTemplate: '/user/profile',
            controller: UserProfileController::class,
            name: 'update_profile',
            openapi: new Operation(
                summary: 'Modifier le profil utilisateur',
                description: 'Met à jour le profil de l\'utilisateur connecté',
            ),
            read: false,
        ),
        new Put(
            uriTemplate: '/user/preferences/weather',
            controller: UserPreferencesController::class,
            name: 'update_weather_preferences',
            openapi: new Operation(
                summary: 'Modifier les préférences météo',
            ),
            read: false,
        ),
        new Put(
            uriTemplate: '/user/preferences/notifications',
            controller: UserPreferencesController::class,
            name: 'update_notification_preferences',
            openapi: new Operation(
                summary: 'Modifier les préférences de notifications',
            ),
            read: false,
        ),
        new Post(
            uriTemplate: '/user/change-password',
            controller: ChangePasswordController::class,
            name: 'change_password',
            openapi: new Operation(
                summary: 'Changer le mot de passe',
            ),
            read: false,
        ),
    ],
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank]
    #[Assert\Email]
    private ?string $email = null;

    #[ORM\Column]
    private array $roles = [];

    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    private ?string $firstName = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank]
    private ?string $lastName = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $phone = null;

    #[ORM\Column(type: 'json')]
    private array $weatherPreferences = [
        'rainAlertThreshold' => 50,
        'geographicZone' => 'Île-de-France',
    ];

    #[ORM\Column(type: 'json')]
    private array $notificationPreferences = [
        'weatherAlerts' => true,
        'interventionReminders' => true,
        'emailNotifications' => true,
    ];

    #[ORM\OneToMany(targetEntity: Notification::class, mappedBy: 'user')]
    private Collection $notifications;

    public function __construct()
    {
        $this->notifications = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function eraseCredentials(): void
    {
    }

    public function getFirstName(): ?string
    {
        return $this->firstName;
    }

    public function setFirstName(string $firstName): static
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): ?string
    {
        return $this->lastName;
    }

    public function setLastName(string $lastName): static
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(?string $phone): static
    {
        $this->phone = $phone;
        return $this;
    }

    public function getWeatherPreferences(): array
    {
        return $this->weatherPreferences;
    }

    public function setWeatherPreferences(array $weatherPreferences): static
    {
        $this->weatherPreferences = $weatherPreferences;
        return $this;
    }

    public function getNotificationPreferences(): array
    {
        return $this->notificationPreferences;
    }

    public function setNotificationPreferences(array $notificationPreferences): static
    {
        $this->notificationPreferences = $notificationPreferences;
        return $this;
    }

    public function getNotifications(): Collection
    {
        return $this->notifications;
    }
}
