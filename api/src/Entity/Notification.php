<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\OpenApi\Model\Operation;
use App\Controller\MarkAllNotificationsReadController;
use App\State\MarkNotificationReadProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'notification')]
#[ApiResource(
    operations: [
        new GetCollection(
            order: ['createdAt' => 'DESC'],
        ),
        new Get(),
        new Post(),
        new Delete(),
        new Put(
            uriTemplate: '/notifications/{id}/read',
            processor: MarkNotificationReadProcessor::class,
            name: 'mark_read',
            openapi: new Operation(
                summary: 'Marquer une notification comme lue',
            ),
            deserialize: false,
        ),
        new Put(
            uriTemplate: '/notifications/read-all',
            controller: MarkAllNotificationsReadController::class,
            name: 'mark_all_read',
            openapi: new Operation(
                summary: 'Marquer toutes les notifications comme lues',
            ),
            read: false,
        ),
    ],
    paginationItemsPerPage: 20,
)]
#[ApiFilter(BooleanFilter::class, properties: ['read'])]
class Notification
{
    public const TYPE_ALERT = 'alert';
    public const TYPE_CALENDAR = 'calendar';
    public const TYPE_INFO = 'info';
    public const TYPE_SUCCESS = 'success';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: [self::TYPE_ALERT, self::TYPE_CALENDAR, self::TYPE_INFO, self::TYPE_SUCCESS])]
    private ?string $type = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Assert\NotBlank]
    private ?string $message = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE)]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column]
    private bool $read = false;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'notifications')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    public function __construct()
    {
        $this->createdAt = new \DateTime();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;
        return $this;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getMessage(): ?string
    {
        return $this->message;
    }

    public function setMessage(string $message): static
    {
        $this->message = $message;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeInterface
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeInterface $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function isRead(): bool
    {
        return $this->read;
    }

    public function setRead(bool $read): static
    {
        $this->read = $read;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }
}
