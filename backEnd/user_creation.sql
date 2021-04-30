CREATE USER 'streamfeeder_admin'@'localhost' IDENTIFIED BY 'tacosandburritos';

GRANT ALL PRIVELEGES ON streamfeeder.* to ‘streamfeeder_admin’@’localhost';