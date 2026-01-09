<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\OpenApi\Model\Operation;
use App\State\RescheduleInterventionProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'intervention')]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Put(),
        new Delete(),
        new Put(
            uriTemplate: '/interventions/{id}/reschedule',
            processor: RescheduleInterventionProcessor::class,
            name: 'reschedule',
            openapi: new Operation(
                summary: 'Reporter une intervention',
                description: 'Change la date d\'une intervention existante',
            ),
            deserialize: false,
            inputFormats: ['jsonld' => ['application/ld+json'], 'json' => ['application/json']],
            outputFormats: ['jsonld' => ['application/ld+json'], 'json' => ['application/json']],
        ),
    ],
    order: ['date' => 'ASC', 'time' => 'ASC'],
    paginationItemsPerPage: 20,
)]
#[ApiFilter(DateFilter::class, properties: ['date'])]
#[ApiFilter(SearchFilter::class, properties: ['status' => 'exact', 'type' => 'exact', 'technician' => 'exact', 'client' => 'exact'])]
class Intervention
{
    public const TYPE_TOITURE = 'Toiture';
    public const TYPE_FACADE = 'Façade';
    public const TYPE_ETANCHEITE = 'Étanchéité';
    public const TYPE_PEINTURE = 'Peinture extérieure';
    public const TYPE_INSPECTION = 'Inspection';

    public const STATUS_PLANIFIEE = 'Planifiée';
    public const STATUS_CONFIRMEE = 'Confirmée';
    public const STATUS_EN_COURS = 'En cours';
    public const STATUS_TERMINEE = 'Terminée';
    public const STATUS_ANNULEE = 'Annulée';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $title = null;

    #[ORM\ManyToOne(targetEntity: Client::class, inversedBy: 'interventions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    private ?Client $client = null;

    #[ORM\ManyToOne(targetEntity: Technician::class, inversedBy: 'interventions')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull]
    private ?Technician $technician = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    #[Assert\NotNull]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column(type: Types::TIME_MUTABLE)]
    #[Assert\NotNull]
    private ?\DateTimeInterface $time = null;

    #[ORM\Column]
    #[Assert\NotNull]
    #[Assert\Positive]
    private ?int $duration = null;

    #[ORM\Column(length: 500)]
    #[Assert\NotBlank]
    private ?string $location = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: [
        self::TYPE_TOITURE,
        self::TYPE_FACADE,
        self::TYPE_ETANCHEITE,
        self::TYPE_PEINTURE,
        self::TYPE_INSPECTION,
    ])]
    private ?string $type = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 50)]
    #[Assert\Choice(choices: [
        self::STATUS_PLANIFIEE,
        self::STATUS_CONFIRMEE,
        self::STATUS_EN_COURS,
        self::STATUS_TERMINEE,
        self::STATUS_ANNULEE,
    ])]
    private string $status = self::STATUS_PLANIFIEE;

    #[ORM\Column(nullable: true)]
    #[Assert\Range(min: 0, max: 100)]
    private ?int $rainProbability = null;

    public function getId(): ?int
    {
        return $this->id;
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

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): static
    {
        $this->client = $client;
        return $this;
    }

    public function getTechnician(): ?Technician
    {
        return $this->technician;
    }

    public function setTechnician(?Technician $technician): static
    {
        $this->technician = $technician;
        return $this;
    }

    public function getDate(): ?\DateTimeInterface
    {
        return $this->date;
    }

    public function setDate(\DateTimeInterface $date): static
    {
        $this->date = $date;
        return $this;
    }

    public function getTime(): ?\DateTimeInterface
    {
        return $this->time;
    }

    public function setTime(\DateTimeInterface $time): static
    {
        $this->time = $time;
        return $this;
    }

    public function getDuration(): ?int
    {
        return $this->duration;
    }

    public function setDuration(int $duration): static
    {
        $this->duration = $duration;
        return $this;
    }

    public function getLocation(): ?string
    {
        return $this->location;
    }

    public function setLocation(string $location): static
    {
        $this->location = $location;
        return $this;
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

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function setStatus(string $status): static
    {
        $this->status = $status;
        return $this;
    }

    public function getRainProbability(): ?int
    {
        return $this->rainProbability;
    }

    public function setRainProbability(?int $rainProbability): static
    {
        $this->rainProbability = $rainProbability;
        return $this;
    }
}
