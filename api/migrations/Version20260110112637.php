<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260110112637 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Initial schema: User, Client, Technician, Intervention, Notification tables';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE client (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type VARCHAR(50) NOT NULL, phone VARCHAR(20) NOT NULL, email VARCHAR(255) NOT NULL, address VARCHAR(500) NOT NULL, status VARCHAR(50) NOT NULL)');
        $this->addSql('CREATE TABLE intervention (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, client_id INTEGER NOT NULL, technician_id INTEGER NOT NULL, title VARCHAR(255) NOT NULL, date DATE NOT NULL, time TIME NOT NULL, duration INTEGER NOT NULL, location VARCHAR(500) NOT NULL, type VARCHAR(50) NOT NULL, description CLOB DEFAULT NULL, status VARCHAR(50) NOT NULL, rain_probability INTEGER DEFAULT NULL, CONSTRAINT FK_D11814AB19EB6921 FOREIGN KEY (client_id) REFERENCES client (id) NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_D11814ABE6C5D496 FOREIGN KEY (technician_id) REFERENCES technician (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_D11814AB19EB6921 ON intervention (client_id)');
        $this->addSql('CREATE INDEX IDX_D11814ABE6C5D496 ON intervention (technician_id)');
        $this->addSql('CREATE TABLE notification (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, user_id INTEGER NOT NULL, type VARCHAR(50) NOT NULL, title VARCHAR(255) NOT NULL, message CLOB NOT NULL, created_at DATETIME NOT NULL, read BOOLEAN NOT NULL, CONSTRAINT FK_BF5476CAA76ED395 FOREIGN KEY (user_id) REFERENCES "user" (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_BF5476CAA76ED395 ON notification (user_id)');
        $this->addSql('CREATE TABLE technician (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, role VARCHAR(100) NOT NULL, phone VARCHAR(20) NOT NULL, email VARCHAR(255) NOT NULL, location VARCHAR(255) NOT NULL, status VARCHAR(50) NOT NULL, specialties CLOB NOT NULL --(DC2Type:json)
        )');
        $this->addSql('CREATE TABLE "user" (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles CLOB NOT NULL --(DC2Type:json)
        , password VARCHAR(255) NOT NULL, first_name VARCHAR(100) NOT NULL, last_name VARCHAR(100) NOT NULL, phone VARCHAR(20) DEFAULT NULL, weather_preferences CLOB NOT NULL --(DC2Type:json)
        , notification_preferences CLOB NOT NULL --(DC2Type:json)
        )');
        $this->addSql('CREATE UNIQUE INDEX UNIQ_USER_EMAIL ON "user" (email)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE client');
        $this->addSql('DROP TABLE intervention');
        $this->addSql('DROP TABLE notification');
        $this->addSql('DROP TABLE technician');
        $this->addSql('DROP TABLE "user"');
    }
}
