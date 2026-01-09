<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity]
#[ORM\Table(name: 'client')]
#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Put(),
        new Delete(),
    ],
    order: ['name' => 'ASC'],
    paginationItemsPerPage: 20,
)]
class Client
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    private ?string $name = null;

    #[ORM\Column(length: 50)]
    #[Assert\NotBlank]
    #[Assert\Choice(choices: ['Syndic', 'Particulier', 'Copropriété', 'Entreprise', 'Collectivité'])]
    private ?string $type = null;

    #[ORM\Column(length: 20)]
    #[Assert\NotBlank]
    private ?string $phone = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Assert\Email]
    private ?string $email = null;

    #[ORM\Column(length: 500)]
    #[Assert\NotBlank]
    private ?string $address = null;

    #[ORM\Column(length: 50)]
    #[Assert\Choice(choices: ['Actif', 'Inactif'])]
    private string $status = 'Actif';

    #[ORM\OneToMany(targetEntity: Intervention::class, mappedBy: 'client')]
    private Collection $interventions;

    public function __construct()
    {
        $this->interventions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;
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

    public function getPhone(): ?string
    {
        return $this->phone;
    }

    public function setPhone(string $phone): static
    {
        $this->phone = $phone;
        return $this;
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

    public function getAddress(): ?string
    {
        return $this->address;
    }

    public function setAddress(string $address): static
    {
        $this->address = $address;
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

    public function getInterventions(): Collection
    {
        return $this->interventions;
    }

    public function addIntervention(Intervention $intervention): static
    {
        if (!$this->interventions->contains($intervention)) {
            $this->interventions->add($intervention);
            $intervention->setClient($this);
        }
        return $this;
    }

    public function removeIntervention(Intervention $intervention): static
    {
        if ($this->interventions->removeElement($intervention)) {
            if ($intervention->getClient() === $this) {
                $intervention->setClient(null);
            }
        }
        return $this;
    }

    public function getInterventionsCount(): int
    {
        return $this->interventions->count();
    }
}
