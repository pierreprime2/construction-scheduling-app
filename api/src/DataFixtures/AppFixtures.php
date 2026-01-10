<?php

namespace App\DataFixtures;

use App\Entity\Client;
use App\Entity\Intervention;
use App\Entity\Notification;
use App\Entity\Technician;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher
    ) {}

    public function load(ObjectManager $manager): void
    {
        // =========================================
        // USERS
        // =========================================
        $users = [];

        // Admin user (easy credentials for dev)
        $admin = new User();
        $admin->setEmail('admin@cogit.fr');
        $admin->setFirstName('Pierre');
        $admin->setLastName('Martin');
        $admin->setPhone('06 12 34 56 78');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin'));
        $admin->setWeatherPreferences([
            'rainAlertThreshold' => 50,
            'geographicZone' => 'Île-de-France',
        ]);
        $admin->setNotificationPreferences([
            'weatherAlerts' => true,
            'interventionReminders' => true,
            'emailNotifications' => true,
        ]);
        $manager->persist($admin);
        $users[] = $admin;

        // Regular user
        $user = new User();
        $user->setEmail('marie@cogit.fr');
        $user->setFirstName('Marie');
        $user->setLastName('Dupont');
        $user->setPhone('06 98 76 54 32');
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($this->passwordHasher->hashPassword($user, 'user'));
        $manager->persist($user);
        $users[] = $user;

        // Technician user
        $techUser = new User();
        $techUser->setEmail('jean@cogit.fr');
        $techUser->setFirstName('Jean');
        $techUser->setLastName('Leclerc');
        $techUser->setPhone('06 55 44 33 22');
        $techUser->setRoles(['ROLE_TECHNICIAN']);
        $techUser->setPassword($this->passwordHasher->hashPassword($techUser, 'tech'));
        $manager->persist($techUser);
        $users[] = $techUser;

        // =========================================
        // CLIENTS
        // =========================================
        $clientsData = [
            ['name' => 'Syndic Belleville', 'type' => 'Syndic', 'phone' => '01 45 67 89 00', 'email' => 'contact@syndic-belleville.fr', 'address' => '15 rue de Belleville, 75020 Paris'],
            ['name' => 'Copropriété Les Lilas', 'type' => 'Copropriété', 'phone' => '01 43 62 58 90', 'email' => 'syndic@copro-lilas.fr', 'address' => '8 avenue des Lilas, 93260 Les Lilas'],
            ['name' => 'SCI Haussmann', 'type' => 'Entreprise', 'phone' => '01 42 65 78 90', 'email' => 'gestion@sci-haussmann.fr', 'address' => '45 boulevard Haussmann, 75009 Paris'],
            ['name' => 'M. et Mme Dubois', 'type' => 'Particulier', 'phone' => '06 78 90 12 34', 'email' => 'dubois.jean@gmail.com', 'address' => '23 rue Victor Hugo, 92100 Boulogne'],
            ['name' => 'Mairie de Montreuil', 'type' => 'Collectivité', 'phone' => '01 48 70 60 00', 'email' => 'batiments@montreuil.fr', 'address' => 'Place Jean Jaurès, 93100 Montreuil'],
            ['name' => 'Résidence du Parc', 'type' => 'Copropriété', 'phone' => '01 45 33 22 11', 'email' => 'syndic@residence-parc.fr', 'address' => '12 allée du Parc, 94300 Vincennes'],
            ['name' => 'Foncia Paris Est', 'type' => 'Syndic', 'phone' => '01 43 72 80 00', 'email' => 'paris-est@foncia.fr', 'address' => '67 avenue Gambetta, 75020 Paris'],
            ['name' => 'M. Laurent', 'type' => 'Particulier', 'phone' => '06 11 22 33 44', 'email' => 'p.laurent@orange.fr', 'address' => '5 rue de la Paix, 75002 Paris'],
            ['name' => 'SARL Immobilière Nation', 'type' => 'Entreprise', 'phone' => '01 44 55 66 77', 'email' => 'contact@immo-nation.fr', 'address' => '100 rue de la Roquette, 75011 Paris'],
            ['name' => 'Copropriété Faidherbe', 'type' => 'Copropriété', 'phone' => '01 43 71 82 93', 'email' => 'conseil@copro-faidherbe.fr', 'address' => '28 rue Faidherbe, 75011 Paris'],
        ];

        $clients = [];
        foreach ($clientsData as $data) {
            $client = new Client();
            $client->setName($data['name']);
            $client->setType($data['type']);
            $client->setPhone($data['phone']);
            $client->setEmail($data['email']);
            $client->setAddress($data['address']);
            $client->setStatus('Actif');
            $manager->persist($client);
            $clients[] = $client;
        }

        // =========================================
        // TECHNICIANS
        // =========================================
        $techniciansData = [
            ['name' => 'Jean Dupont', 'role' => "Chef d'équipe", 'phone' => '06 12 34 56 78', 'email' => 'j.dupont@cogit.fr', 'location' => 'Paris 20e', 'specialties' => ['Toiture', 'Étanchéité']],
            ['name' => 'Marc Lefebvre', 'role' => 'Technicien', 'phone' => '06 23 45 67 89', 'email' => 'm.lefebvre@cogit.fr', 'location' => 'Montreuil', 'specialties' => ['Façade', 'Peinture extérieure']],
            ['name' => 'Sophie Bernard', 'role' => 'Technicienne', 'phone' => '06 34 56 78 90', 'email' => 's.bernard@cogit.fr', 'location' => 'Vincennes', 'specialties' => ['Inspection', 'Toiture']],
            ['name' => 'Thomas Moreau', 'role' => "Chef d'équipe", 'phone' => '06 45 67 89 01', 'email' => 't.moreau@cogit.fr', 'location' => 'Paris 11e', 'specialties' => ['Étanchéité', 'Façade']],
            ['name' => 'Nathalie Petit', 'role' => 'Technicienne', 'phone' => '06 56 78 90 12', 'email' => 'n.petit@cogit.fr', 'location' => 'Boulogne', 'specialties' => ['Toiture', 'Inspection']],
            ['name' => 'François Garcia', 'role' => 'Technicien', 'phone' => '06 67 89 01 23', 'email' => 'f.garcia@cogit.fr', 'location' => 'Les Lilas', 'specialties' => ['Peinture extérieure', 'Façade']],
            ['name' => 'Isabelle Roux', 'role' => 'Technicienne', 'phone' => '06 78 90 12 34', 'email' => 'i.roux@cogit.fr', 'location' => 'Paris 9e', 'specialties' => ['Toiture', 'Étanchéité', 'Inspection']],
            ['name' => 'Philippe Martin', 'role' => "Chef d'équipe", 'phone' => '06 89 01 23 45', 'email' => 'p.martin@cogit.fr', 'location' => 'Paris 2e', 'specialties' => ['Façade', 'Toiture']],
        ];

        $technicians = [];
        foreach ($techniciansData as $data) {
            $tech = new Technician();
            $tech->setName($data['name']);
            $tech->setRole($data['role']);
            $tech->setPhone($data['phone']);
            $tech->setEmail($data['email']);
            $tech->setLocation($data['location']);
            $tech->setSpecialties($data['specialties']);
            $tech->setStatus('Actif');
            $manager->persist($tech);
            $technicians[] = $tech;
        }

        // =========================================
        // INTERVENTIONS
        // =========================================
        $interventionsData = [
            // Interventions passées
            ['title' => 'Réparation toiture immeuble Belleville', 'client' => 0, 'technician' => 0, 'date' => '-5 days', 'time' => '09:00', 'duration' => 4, 'type' => 'Toiture', 'status' => 'Terminée', 'rain' => 10],
            ['title' => 'Inspection façade copropriété', 'client' => 1, 'technician' => 2, 'date' => '-3 days', 'time' => '14:00', 'duration' => 2, 'type' => 'Inspection', 'status' => 'Terminée', 'rain' => 5],

            // Interventions en cours
            ['title' => 'Étanchéité terrasse SCI Haussmann', 'client' => 2, 'technician' => 3, 'date' => 'today', 'time' => '08:00', 'duration' => 6, 'type' => 'Étanchéité', 'status' => 'En cours', 'rain' => 15],

            // Interventions à venir (prochains jours)
            ['title' => 'Peinture façade maison Dubois', 'client' => 3, 'technician' => 1, 'date' => '+1 day', 'time' => '09:00', 'duration' => 8, 'type' => 'Peinture extérieure', 'status' => 'Confirmée', 'rain' => 20],
            ['title' => 'Inspection toiture mairie', 'client' => 4, 'technician' => 4, 'date' => '+2 days', 'time' => '10:00', 'duration' => 3, 'type' => 'Inspection', 'status' => 'Planifiée', 'rain' => 45],
            ['title' => 'Réparation étanchéité Résidence du Parc', 'client' => 5, 'technician' => 6, 'date' => '+3 days', 'time' => '08:30', 'duration' => 5, 'type' => 'Étanchéité', 'status' => 'Planifiée', 'rain' => 60],
            ['title' => 'Ravalement façade Foncia', 'client' => 6, 'technician' => 5, 'date' => '+4 days', 'time' => '07:30', 'duration' => 10, 'type' => 'Façade', 'status' => 'Planifiée', 'rain' => 25],
            ['title' => 'Toiture maison M. Laurent', 'client' => 7, 'technician' => 0, 'date' => '+5 days', 'time' => '09:00', 'duration' => 4, 'type' => 'Toiture', 'status' => 'Planifiée', 'rain' => 30],
            ['title' => 'Inspection générale SARL Nation', 'client' => 8, 'technician' => 2, 'date' => '+6 days', 'time' => '14:00', 'duration' => 2, 'type' => 'Inspection', 'status' => 'Planifiée', 'rain' => 10],
            ['title' => 'Étanchéité toiture Faidherbe', 'client' => 9, 'technician' => 3, 'date' => '+7 days', 'time' => '08:00', 'duration' => 6, 'type' => 'Étanchéité', 'status' => 'Planifiée', 'rain' => 55],

            // Interventions à risque météo (pour le dashboard)
            ['title' => 'Peinture extérieure Les Lilas', 'client' => 1, 'technician' => 1, 'date' => '+2 days', 'time' => '08:00', 'duration' => 8, 'type' => 'Peinture extérieure', 'status' => 'Planifiée', 'rain' => 75],
            ['title' => 'Façade immeuble Belleville', 'client' => 0, 'technician' => 7, 'date' => '+3 days', 'time' => '09:00', 'duration' => 6, 'type' => 'Façade', 'status' => 'Planifiée', 'rain' => 80],
        ];

        $interventions = [];
        foreach ($interventionsData as $data) {
            $intervention = new Intervention();
            $intervention->setTitle($data['title']);
            $intervention->setClient($clients[$data['client']]);
            $intervention->setTechnician($technicians[$data['technician']]);
            $intervention->setDate(new \DateTime($data['date']));
            $intervention->setTime(new \DateTime($data['time']));
            $intervention->setDuration($data['duration']);
            $intervention->setLocation($clients[$data['client']]->getAddress());
            $intervention->setType($data['type']);
            $intervention->setStatus($data['status']);
            $intervention->setRainProbability($data['rain']);
            $intervention->setDescription('Intervention programmée pour ' . $clients[$data['client']]->getName());
            $manager->persist($intervention);
            $interventions[] = $intervention;
        }

        // =========================================
        // NOTIFICATIONS
        // =========================================
        $notificationsData = [
            ['type' => 'alert', 'title' => 'Alerte météo', 'message' => 'Risque de pluie élevé (75%) prévu pour l\'intervention "Peinture extérieure Les Lilas" dans 2 jours. Report recommandé.', 'read' => false, 'user' => 0, 'date' => '-1 hour'],
            ['type' => 'alert', 'title' => 'Alerte météo', 'message' => 'Risque de pluie élevé (80%) prévu pour l\'intervention "Façade immeuble Belleville" dans 3 jours.', 'read' => false, 'user' => 0, 'date' => '-2 hours'],
            ['type' => 'calendar', 'title' => 'Intervention confirmée', 'message' => 'L\'intervention "Peinture façade maison Dubois" a été confirmée pour demain à 09:00.', 'read' => false, 'user' => 0, 'date' => '-3 hours'],
            ['type' => 'success', 'title' => 'Intervention terminée', 'message' => 'L\'intervention "Réparation toiture immeuble Belleville" a été marquée comme terminée.', 'read' => true, 'user' => 0, 'date' => '-1 day'],
            ['type' => 'info', 'title' => 'Nouveau technicien', 'message' => 'Philippe Martin a rejoint l\'équipe en tant que chef d\'équipe.', 'read' => true, 'user' => 0, 'date' => '-2 days'],
            ['type' => 'calendar', 'title' => 'Rappel intervention', 'message' => 'Rappel: Inspection toiture mairie prévue dans 2 jours.', 'read' => false, 'user' => 0, 'date' => '-30 minutes'],
        ];

        foreach ($notificationsData as $data) {
            $notification = new Notification();
            $notification->setType($data['type']);
            $notification->setTitle($data['title']);
            $notification->setMessage($data['message']);
            $notification->setRead($data['read']);
            $notification->setUser($users[$data['user']]);
            $notification->setCreatedAt(new \DateTime($data['date']));
            $manager->persist($notification);
        }

        $manager->flush();
    }
}
