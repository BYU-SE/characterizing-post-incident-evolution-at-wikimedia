## All Repos

### === operations/puppet (801 PIC commits) ===


--- Top 20 most changed files in operations/puppet ---
  32    manifests/site.pp                   # 3% of PIC changes to this repo, so not super common
  19    hieradata/common/service.yaml
  11    hieradata/common.yaml
  11    modules/profile/manifests/prometheus/ops.pp
  10    modules/install_server/files/autoinstall/netboot.cfg
  10    modules/varnish/templates/text-frontend.inc.vcl.erb
  9     modules/profile/manifests/base.pp
  8     modules/wdqs/templates/logback.xml.erb
  8     hieradata/labs/deployment-prep/common.yaml
  8     modules/profile/manifests/homer.pp
  7     modules/profile/manifests/prometheus/alerts.pp
  7     hieradata/cloud.yaml
  7     modules/smokeping/templates/config.d/Targets.erb
  6     modules/admin/data/data.yaml
  6     hieradata/role/common/mediawiki/appserver.yaml
  6     manifests/role/mariadb.pp
  6     modules/cassandra/manifests/init.pp
  6     modules/netops/manifests/monitoring.pp
  6     modules/base/templates/remote_syslog.conf.erb
  6     hieradata/common/profile/base.yaml

--- Top 20 most changed directories (2 levels) in operations/puppet ---
  336   modules/profile   # may be different for each application
  128   hieradata/hosts   # host specific configuration
  127   hieradata/role    # may be different for each application
  93    modules/role      
  76    .../files
  58    hieradata/common
  54    .../profile
  48    .../templates
  32    manifests/role
  32    manifests/site.pp
  30    modules/openstack
  29    .../manifests
  28    .../logstash
  24    modules/mariadb
  22    modules/wdqs
  21    modules/varnish
  20    modules/labstore
  19    modules/base
  18    modules/gerrit
  17    modules/scap


Changed 1092 distinct files, though some more than once (1744 file changes).

Known services count:
prometheus: 41
mariadb: 123
logstash: 107
eventstreams: 6
dbbackups: 40
gerrit: 22
icinga: 20
ores: 10
openstack: 41
syslog: 31
phabricator: 19


### === operations/mediawiki-config (126 PIC commits) ===


--- Top 20 most changed files in operations/mediawiki-config ---
  42    wmf-config/InitialiseSettings.php
  25    wmf-config/CommonSettings.php
  14    wmf-config/InitialiseSettings-labs.php
  10    wmf-config/db-eqiad.php
  9     wmf-config/ProductionServices.php
  7     wmf-config/CommonSettings-labs.php
  7     multiversion/MWConfigCacheGenerator.php
  6     wmf-config/PoolCounterSettings.php
  4     wikiversions.json
  4     wmf-config/Wikibase.php
  3     composer.json
  3     tests/dblistTest.php
  2     wmf-config/db-labs.php
  2     wmf-config/logging.php
  2     php
  2     tests/multiversion/StaticSettingsTest.php
  2     composer.lock
  2     wmf-config/config/aawiki.yaml
  2     wmf-config/config/aawikibooks.yaml
  2     wmf-config/config/aawiktionary.yaml

--- Top 20 most changed directories (2 levels) in operations/mediawiki-config ---
  1955  wmf-config/config                    # This seems to also be per-wiki config, seems like it was folded into InitialiseSettings which has things organized in one large file by setting
  42    wmf-config/InitialiseSettings.php    # Per-wiki configuration
  25    wmf-config/CommonSettings.php        # Generic configuration such as including extensions or calling over a piece of config, shared mostly by all wikis
  14    wmf-config/InitialiseSettings-labs.php
  14    (root)
  10    wmf-config/db-eqiad.php
  9     wmf-config/ProductionServices.php
  7     wmf-config/CommonSettings-labs.php
  7     multiversion/MWConfigCacheGenerator.php
  7     docroot/noc
  6     wmf-config/PoolCounterSettings.php
  4     wmf-config/Wikibase.php
  3     tests/dblistTest.php
  2     wmf-config/db-labs.php
  2     wmf-config/logging.php
  2     tests/multiversion
  2     vendor/composer
  2     .../gettingstarted-with-category-suggestions.yaml
  2     multiversion/buildDBLists.php
  2     tests/DBList.php

Changed 1134 distinct files, though 2211 files were changed in total.
wmf-config has a note that "The MediaWiki configuration for all database." Think of it like a huge LocalSettings.php."

*-labs.php (files used by beta cluster to override production settings): 10

937 settings (as of 2/20/26 check)
~945 wikis



### === mediawiki/core (90 PIC commits) ===


--- Top 20 most changed files in mediawiki/core ---
  5     includes/objectcache/SqlBagOStuff.php
  5     includes/specials/SpecialChangeEmail.php
  5     includes/password/EncryptedPassword.php
  5     includes/logging/LogEventsList.php
  4     includes/MagicWord.php
  4     autoload.php
  3     tests/selenium/specs/page.js
  3     docs/extension.schema.v1.json
  3     docs/extension.schema.v2.json
  3     includes/registration/ExtensionRegistry.php
  3     .../registration/ExtensionRegistryTest.php
  3     RELEASE-NOTES-1.29
  3     languages/i18n/qqq.json
  3     includes/installer/DatabaseUpdater.php
  3     includes/libs/rdbms/loadbalancer/LoadBalancer.php
  3     includes/filerepo/file/LocalFile.php
  3     includes/libs/rdbms/loadmonitor/LoadMonitor.php
  2     includes/MediaWiki.php
  2     tests/phpunit/MediaWikiTestCase.php
  2     maintenance/Maintenance.php

--- Top 20 most changed directories (2 levels) in mediawiki/core ---
  18    includes/libs
  17    includes/filerepo
  16    (root)
  11    includes/specials
  8     tests/phpunit
  7     tests/selenium
  7     includes/parser
  7     maintenance/storage
  6     includes/api
  6     includes/logging
  5     includes/objectcache
  5     includes/password
  5     languages/i18n
  5     .../libs
  4     includes/MagicWord.php
  3     docs/extension.schema.v1.json
  3     docs/extension.schema.v2.json
  3     includes/registration
  3     .../registration
  3     includes/installer

159 unique files, 224 file changes.

## Investigate PIC commits in operations/mediawiki-config

1. 239ea0e4f5d27140ef8af6ffc7dc493562bd9d5e

Change to wmf-config/InitialiseSettings-lab.php. Single conf line. for Lab Settings

2. 695bcee5ccb46f8e88a473a88c0e0df837e5e467

Initial commit before #1, Single conf line for LabSettings

3. c4f6fad97f10cae097e42d4c00dba4612c9d4948

Refactor of login logging

4. a3952e4f6aa90e0e16beb71134dbf05332675aed

Simple config to wmf-config/InitialiseSettings.php
