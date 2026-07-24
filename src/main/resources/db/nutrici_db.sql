-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : ven. 24 juil. 2026 à 10:09
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `nutrici_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `categorie`
--

CREATE TABLE `categorie` (
  `id` bigint(20) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `libelle` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `categorie`
--

INSERT INTO `categorie` (`id`, `code`, `libelle`) VALUES
(1, 'VIT', 'Vitamines'),
(2, 'VIT', 'Vitamines'),
(3, 'MIN', 'Minéraux'),
(4, 'PRO', 'Protéines'),
(5, 'OMG', 'Oméga-3'),
(6, 'HER', 'Plantes et Herbes'),
(7, 'VIT', 'Vitamines'),
(8, 'VIT', 'Vitamines'),
(9, 'VIT', 'Vitamines'),
(10, 'MIN', 'Minéraux'),
(11, 'PRO', 'Protéines'),
(12, 'OMG', 'Oméga-3'),
(13, 'HER', 'Plantes et Herbes'),
(14, 'VIT', 'Vitamines'),
(15, 'MIN', 'Minéraux'),
(16, 'BEA', 'Beauté & Bien-être'),
(17, 'NUT', 'Nutrition & Plantes');

-- --------------------------------------------------------

--
-- Structure de la table `client`
--

CREATE TABLE `client` (
  `id` bigint(20) NOT NULL,
  `adresse` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prenom` varchar(255) DEFAULT NULL,
  `telephone` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `client`
--

INSERT INTO `client` (`id`, `adresse`, `email`, `nom`, `prenom`, `telephone`) VALUES
(1, '1 rue de Paris, 75000 Paris', 'jean.dupont@email.com', 'Dupont', 'Jean', '0612345678'),
(2, '1 rue de Paris, 75000 Paris', 'jean.dupont@email.com', 'Dupont', 'Jean', '0612345678'),
(3, '5 avenue des Champs, 69000 Lyon', 'sophie.martin@email.com', 'Martin', 'Sophie', '0687654321'),
(4, '10 boulevard de la Mer, 13000 Marseille', 'pierre.bernard@email.com', 'Bernard', 'Pierre', '0712345678'),
(5, 'abidjan', 'jean.kouassi@email.com', 'kouassi', 'Jean', '0612345678'),
(6, '1 rue de Paris, 75000 Paris', 'jean.dupont@email.com', 'Dupont', 'Jean', '0612345678'),
(7, '5 avenue des Champs, 69000 Lyon', 'sophie.martin@email.com', 'Martin', 'Sophie', '0687654321'),
(8, 'Dokui olympe', 'epiessis004@gmail.com', 'Essis', 'Aude', '0504613278');

-- --------------------------------------------------------

--
-- Structure de la table `commande`
--

CREATE TABLE `commande` (
  `id` bigint(20) NOT NULL,
  `date_commande` datetime(6) DEFAULT NULL,
  `montant_total` float NOT NULL,
  `statut` varchar(255) DEFAULT NULL,
  `client_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `commande`
--

INSERT INTO `commande` (`id`, `date_commande`, `montant_total`, `statut`, `client_id`) VALUES
(6, '2026-07-24 07:30:23.000000', 5000, 'EN_ATTENTE', 8),
(7, '2026-07-24 07:33:23.000000', 5000, 'EN_ATTENTE', 8),
(8, '2026-07-24 07:33:43.000000', 13000, 'EN_ATTENTE', 8),
(9, '2026-07-24 07:34:05.000000', 13000, 'EN_ATTENTE', 8),
(10, '2026-07-24 07:38:35.000000', 13000, 'EN_ATTENTE', 8),
(11, '2026-07-24 07:38:57.000000', 13000, 'EN_ATTENTE', 8),
(12, '2026-07-24 07:40:20.000000', 13000, 'EN_ATTENTE', 8),
(13, '2026-07-24 07:40:33.000000', 13000, 'PAYEE', 8),
(14, '2026-07-24 07:56:56.000000', 13000, 'PAYEE', 8);

-- --------------------------------------------------------

--
-- Structure de la table `ligne_commande`
--

CREATE TABLE `ligne_commande` (
  `id` bigint(20) NOT NULL,
  `prix_facture` float NOT NULL,
  `quantite_commandee` int(11) NOT NULL,
  `commande_id` bigint(20) DEFAULT NULL,
  `produit_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `ligne_commande`
--

INSERT INTO `ligne_commande` (`id`, `prix_facture`, `quantite_commandee`, `commande_id`, `produit_id`) VALUES
(5, 5000, 1, 6, 27),
(6, 5000, 1, 7, 27),
(7, 5000, 1, 8, 27),
(8, 8000, 1, 8, 28),
(9, 5000, 1, 9, 27),
(10, 8000, 1, 9, 28),
(11, 5000, 1, 10, 27),
(12, 8000, 1, 10, 28),
(13, 5000, 1, 11, 27),
(14, 8000, 1, 11, 28),
(15, 5000, 1, 12, 27),
(16, 8000, 1, 12, 28),
(17, 5000, 1, 13, 27),
(18, 8000, 1, 13, 28),
(19, 5000, 1, 14, 27),
(20, 8000, 1, 14, 28);

-- --------------------------------------------------------

--
-- Structure de la table `produit`
--

CREATE TABLE `produit` (
  `id` bigint(20) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `nom` varchar(255) DEFAULT NULL,
  `prix_unitaire` float NOT NULL,
  `qte_stock` int(11) NOT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `categorie_id` bigint(20) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `produit`
--

INSERT INTO `produit` (`id`, `description`, `nom`, `prix_unitaire`, `qte_stock`, `reference`, `categorie_id`, `image`) VALUES
(27, 'Complément apaisant', 'Aura Zen', 5000, 41, 'PROD001', 16, 'auraZen.jpg'),
(28, 'Collagène pour la peau', 'Collagène Marin', 8000, 43, 'PROD002', 16, 'collagen.jpg'),
(29, 'Complément pour la vue', 'Forever Vision', 6000, 50, 'PROD003', 16, 'forevervision.jpg'),
(30, 'Soutien de l\'humeur', 'Humeur Sereine', 5500, 50, 'PROD004', 16, 'humeur.jpg'),
(31, 'Cheveux et ongles', 'Kératine Forte', 7000, 50, 'PROD005', 16, 'keratine.jpg'),
(32, 'Magnésium issu de l\'eau de mer', 'Magnésium Marin', 4500, 50, 'PROD006', 3, 'magnesium.jpg'),
(33, 'Complément énergisant', 'Nitrico Booster', 6500, 50, 'PROD007', 3, 'nitrico.jpg'),
(34, 'Acides gras essentiels', 'Oméga-3 Poisson', 7500, 50, 'PROD008', 17, 'omega3.jpg'),
(35, 'Flore intestinale', 'Probiotique Plus', 6000, 50, 'PROD009', 17, 'probiotique.jpg'),
(36, 'Aide à l\'endormissement', 'Sommeil Paisible', 5000, 50, 'PROD010', 16, 'sommeil.jpg'),
(37, 'Immunité et os', 'Vitamine D 2000UI', 3500, 50, 'PROD011', 1, 'vitaminD.jpg'),
(38, 'Vision et peau', 'Vitamine A', 4000, 50, 'PROD012', 1, 'vitamineA.jpg'),
(39, 'Immunité renforcée', 'Vitamine C 1000mg', 3000, 50, 'PROD013', 1, 'vitamineC.jpg'),
(40, 'Renforce l\'immunité', 'Zinc Essentiel', 4200, 50, 'PROD014', 3, 'zinc.jpg'),
(41, 'Complément à base de plantes', 'Terravita', 5500, 50, 'PROD015', 17, 'terravita.jpg'),
(42, 'Algue riche en protéines et fer', 'Spiruline Bio', 6500, 50, 'PROD016', 17, 'spiruline.jpg');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `categorie`
--
ALTER TABLE `categorie`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `client`
--
ALTER TABLE `client`
  ADD PRIMARY KEY (`id`);

--
-- Index pour la table `commande`
--
ALTER TABLE `commande`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK79q1nginx2k3m83vi3bt3rlon` (`client_id`);

--
-- Index pour la table `ligne_commande`
--
ALTER TABLE `ligne_commande`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKaff2bjyreiuyi723relg10spm` (`commande_id`),
  ADD KEY `FK5ykb96p8me6913jyiwbe8nyj5` (`produit_id`);

--
-- Index pour la table `produit`
--
ALTER TABLE `produit`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK52xhp55kbbl6u4rbluxm3g9hw` (`categorie_id`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `categorie`
--
ALTER TABLE `categorie`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT pour la table `client`
--
ALTER TABLE `client`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT pour la table `commande`
--
ALTER TABLE `commande`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT pour la table `ligne_commande`
--
ALTER TABLE `ligne_commande`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT pour la table `produit`
--
ALTER TABLE `produit`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=43;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `commande`
--
ALTER TABLE `commande`
  ADD CONSTRAINT `FK79q1nginx2k3m83vi3bt3rlon` FOREIGN KEY (`client_id`) REFERENCES `client` (`id`);

--
-- Contraintes pour la table `ligne_commande`
--
ALTER TABLE `ligne_commande`
  ADD CONSTRAINT `FK5ykb96p8me6913jyiwbe8nyj5` FOREIGN KEY (`produit_id`) REFERENCES `produit` (`id`),
  ADD CONSTRAINT `FKaff2bjyreiuyi723relg10spm` FOREIGN KEY (`commande_id`) REFERENCES `commande` (`id`);

--
-- Contraintes pour la table `produit`
--
ALTER TABLE `produit`
  ADD CONSTRAINT `FK52xhp55kbbl6u4rbluxm3g9hw` FOREIGN KEY (`categorie_id`) REFERENCES `categorie` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
