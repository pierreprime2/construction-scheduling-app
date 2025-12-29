-- schema_planning_weather.sql
-- MySQL schema for multi-tenant planning + weather-aware interventions

-- Use UTF8MB4 for emojis / all chars
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================
-- TENANCY & AUTHENTICATION
-- =========================

CREATE TABLE tenants (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(255) NOT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NULL ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE users (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id       BIGINT UNSIGNED NOT NULL,
    email           VARCHAR(255) NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    role            ENUM('ADMIN','PLANNER','TECHNICIAN','CLIENT') NOT NULL DEFAULT 'PLANNER',
    is_active       TINYINT(1) NOT NULL DEFAULT 1,
    last_login_at   DATETIME NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_users_tenant_email (tenant_id, email),
    CONSTRAINT fk_users_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===========
-- TECHNICIANS
-- ===========

CREATE TABLE technicians (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id       BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED NULL,
    first_name      VARCHAR(100) NOT NULL,
    last_name       VARCHAR(100) NOT NULL,
    phone_number    VARCHAR(50) NULL,
    status          ENUM('OFF_DUTY','ON_MISSION','ON_LEAVE') NOT NULL DEFAULT 'OFF_DUTY',
    hired_at        DATE NULL,
    notes           TEXT NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_technicians_tenant (tenant_id),
    CONSTRAINT fk_technicians_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_technicians_user
        FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Technician specialties as ENUM (from the original prompt)
CREATE TABLE technician_specialties (
    technician_id   BIGINT UNSIGNED NOT NULL,
    specialty       ENUM(
        'COUVREUR_CAP_BP',
        'COUVREUR_ZINGUEUR',
        'ETANCHEUR_BITUME',
        'ETANCHEUR_MEMBRANES_PVC_TPO',
        'TECHNICIEN_SEL',
        'ZINGUEUR_PUR',
        'SARKISTE',
        'POSEUR_VELUX_EXPERT',
        'CORDISTE',
        'TECHNICIEN_RECHERCHE_FUITES',
        'MONTEUR_LIGNE_VIE',
        'COUVREUR_PATRIMOINE_MH',
        'CONDUCTEUR_NACELLE_PEMP',
        'ECHAFAUDEUR'
    ) NOT NULL,
    is_primary      TINYINT(1) NOT NULL DEFAULT 0,
    PRIMARY KEY (technician_id, specialty),
    CONSTRAINT fk_tech_specialties_technician
        FOREIGN KEY (technician_id) REFERENCES technicians(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Leaves (vacation / sickness etc.)
CREATE TABLE technician_leaves (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    technician_id       BIGINT UNSIGNED NOT NULL,
    start_date          DATE NOT NULL,
    end_date            DATE NOT NULL,
    type                ENUM('PAID_LEAVE','UNPAID_LEAVE','SICK_LEAVE','OTHER') NOT NULL DEFAULT 'PAID_LEAVE',
    status              ENUM('PENDING','APPROVED','REJECTED') NOT NULL DEFAULT 'PENDING',
    created_by_user_id  BIGINT UNSIGNED NULL, -- admin or planner
    comments            TEXT NULL,
    created_at          DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_tech_leaves_technician
        FOREIGN KEY (technician_id) REFERENCES technicians(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_tech_leaves_created_by
        FOREIGN KEY (created_by_user_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================
-- WEATHER & LOCATION
-- =====================

-- Sites / work locations (all in Ile-de-France)
CREATE TABLE sites (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id       BIGINT UNSIGNED NOT NULL,
    name            VARCHAR(255) NULL,
    address_line1   VARCHAR(255) NOT NULL,
    address_line2   VARCHAR(255) NULL,
    postal_code     VARCHAR(20) NOT NULL,
    city            VARCHAR(100) NOT NULL,
    region          VARCHAR(100) NOT NULL DEFAULT 'Ile-de-France',
    latitude        DECIMAL(10,7) NULL,
    longitude       DECIMAL(10,7) NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_sites_tenant (tenant_id),
    CONSTRAINT fk_sites_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE weather_forecasts (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    site_id                 BIGINT UNSIGNED NOT NULL,
    forecast_target_date    DATE NOT NULL,
    time_slot               ENUM('MORNING','AFTERNOON') NOT NULL,
    rain_probability        DECIMAL(5,2) NULL,   -- 0-100 %
    expected_precip_mm      DECIMAL(6,2) NULL,
    temperature_min_c       DECIMAL(5,2) NULL,
    temperature_max_c       DECIMAL(5,2) NULL,
    wind_speed_kmh          DECIMAL(6,2) NULL,
    source                  VARCHAR(255) NULL,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_weather_site_date_slot (site_id, forecast_target_date, time_slot),
    KEY idx_weather_site_date (site_id, forecast_target_date),
    CONSTRAINT fk_weather_site
        FOREIGN KEY (site_id) REFERENCES sites(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============
-- INTERVENTION
-- ============

CREATE TABLE interventions (
    id                          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id                   BIGINT UNSIGNED NOT NULL,
    site_id                     BIGINT UNSIGNED NOT NULL,
    -- Client info (denormalized, one-shot clients)
    client_name                 VARCHAR(255) NOT NULL,
    client_email                VARCHAR(255) NULL,
    client_phone                VARCHAR(50) NULL,
    -- Intervention details
    category                    ENUM(
        'TOITURE_PENTE',
        'ETANCHEITE_TERRASSE',
        'ZINGUERIE'
    ) NOT NULL,
    subcategory                 ENUM(
        -- Toiture en pente
        'TOITURE_NEUF',
        'TOITURE_RENOVATION_COMPLETE',
        'TOITURE_REPARATION_DEMOUSSAGE',
        'TOITURE_ISOLATION_EXTERIEUR',
        -- Etancheite toiture terrasse & balcon
        'ETANCHEITE_BITUME',
        'ETANCHEITE_MEMBRANE_PVC_TPO',
        'ETANCHEITE_LIQUIDE',
        'ETANCHEITE_VEGETALISEE',
        -- Zinguerie
        'ZINGUERIE_FENETRES_TOIT',
        'ZINGUERIE_SECURITE_TOIT',
        'ZINGUERIE_URGENCE_FUITE',
        'ZINGUERIE_ENTRETIEN_ANNUEL'
    ) NOT NULL,
    title                       VARCHAR(255) NOT NULL,
    description                 TEXT NULL,
    scheduled_start_datetime    DATETIME NOT NULL,
    scheduled_end_datetime      DATETIME NOT NULL,
    actual_start_datetime       DATETIME NULL,
    actual_end_datetime         DATETIME NULL,
    status                      ENUM('PLANNED','IN_PROGRESS','COMPLETED','CANCELLED','POSTPONED')
                                NOT NULL DEFAULT 'PLANNED',
    assigned_by_admin           TINYINT(1) NOT NULL DEFAULT 1, -- location imposed by administration
    client_time_off_required    TINYINT(1) NOT NULL DEFAULT 0,
    rain_risk_flag              TINYINT(1) NOT NULL DEFAULT 0, -- highlighted if high rain probability
    forecast_rain_probability   DECIMAL(5,2) NULL, -- 0-100 %
    forecast_source             VARCHAR(255) NULL,
    max_technicians             INT NOT NULL DEFAULT 2, -- convenience, not a strict constraint
    created_by_user_id          BIGINT UNSIGNED NULL,
    updated_by_user_id          BIGINT UNSIGNED NULL,
    created_at                  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at                  DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_int_tenant (tenant_id),
    KEY idx_int_site_date (site_id, scheduled_start_datetime),
    KEY idx_int_status (status),
    KEY idx_int_category (category),
    CONSTRAINT fk_int_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_int_site
        FOREIGN KEY (site_id) REFERENCES sites(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT fk_int_created_by
        FOREIGN KEY (created_by_user_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_int_updated_by
        FOREIGN KEY (updated_by_user_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Technicians assigned to interventions (>= 2 per intervention in business logic)
CREATE TABLE intervention_technicians (
    intervention_id     BIGINT UNSIGNED NOT NULL,
    technician_id       BIGINT UNSIGNED NOT NULL,
    role                ENUM('TECHNICIAN','LEAD') NOT NULL DEFAULT 'TECHNICIAN',
    assigned_at         DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (intervention_id, technician_id),
    KEY idx_int_tech_tech (technician_id),
    CONSTRAINT fk_int_tech_intervention
        FOREIGN KEY (intervention_id) REFERENCES interventions(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_int_tech_technician
        FOREIGN KEY (technician_id) REFERENCES technicians(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Rescheduling history (to keep track of shifts due to rain, client, etc.)
CREATE TABLE intervention_reschedules (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    intervention_id         BIGINT UNSIGNED NOT NULL,
    old_start_datetime      DATETIME NOT NULL,
    old_end_datetime        DATETIME NOT NULL,
    new_start_datetime      DATETIME NOT NULL,
    new_end_datetime        DATETIME NOT NULL,
    reason                  ENUM('RAIN','CLIENT_UNAVAILABLE','TECHNICIAN_UNAVAILABLE','MATERIAL','OTHER')
                            NOT NULL DEFAULT 'OTHER',
    created_by_user_id      BIGINT UNSIGNED NULL,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_int_resched_intervention
        FOREIGN KEY (intervention_id) REFERENCES interventions(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_int_resched_created_by
        FOREIGN KEY (created_by_user_id) REFERENCES users(id)
        ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ====================
-- EQUIPMENT & RENTALS
-- ====================

CREATE TABLE equipment (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id       BIGINT UNSIGNED NOT NULL,
    name            VARCHAR(255) NOT NULL,
    description     TEXT NULL,
    is_rental       TINYINT(1) NOT NULL DEFAULT 1,
    default_daily_cost DECIMAL(10,2) NULL,
    created_at      DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_equipment_tenant (tenant_id),
    CONSTRAINT fk_equipment_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE equipment_rentals (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tenant_id               BIGINT UNSIGNED NOT NULL,
    equipment_id            BIGINT UNSIGNED NOT NULL,
    provider_name           VARCHAR(255) NULL,
    rental_start_datetime   DATETIME NOT NULL,
    rental_end_datetime     DATETIME NOT NULL,
    non_refundable          TINYINT(1) NOT NULL DEFAULT 1,
    total_cost              DECIMAL(10,2) NULL,
    notes                   TEXT NULL,
    created_at              DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at              DATETIME NULL ON UPDATE CURRENT_TIMESTAMP,
    KEY idx_equipment_rentals_tenant (tenant_id),
    KEY idx_equipment_rentals_equipment (equipment_id),
    CONSTRAINT fk_equipment_rentals_tenant
        FOREIGN KEY (tenant_id) REFERENCES tenants(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_equipment_rentals_equipment
        FOREIGN KEY (equipment_id) REFERENCES equipment(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Link rentals to interventions (to see which intervention uses which rental)
CREATE TABLE intervention_equipment (
    intervention_id     BIGINT UNSIGNED NOT NULL,
    equipment_rental_id BIGINT UNSIGNED NOT NULL,
    quantity            INT NOT NULL DEFAULT 1,
    PRIMARY KEY (intervention_id, equipment_rental_id),
    CONSTRAINT fk_int_equipment_intervention
        FOREIGN KEY (intervention_id) REFERENCES interventions(id)
        ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_int_equipment_rental
        FOREIGN KEY (equipment_rental_id) REFERENCES equipment_rentals(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ===========================
-- BUSINESS CONSTRAINT COMMENT
-- ===========================
-- Max 2 interventions / day per technician and "at least 2 technicians per intervention"
-- are better enforced at application level or via triggers.
-- This schema provides the necessary relational structure to implement these rules.

SET FOREIGN_KEY_CHECKS = 1;
