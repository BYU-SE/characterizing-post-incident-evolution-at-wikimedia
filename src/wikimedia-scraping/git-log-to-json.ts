import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const gitLogDir = join(__dirname, "..", "..", "data", "wikimedia-gitlog");
export const repoSourceDir = join(__dirname, "..", "..", "data", "repos");

// currently has any repo with more than 10 commits (18 repos)
export const projectToGitLogMap: Record<string, string> = {
  "operations/puppet": "operations-puppet",
  "operations/mediawiki-config": "operations-mediawiki-config",
  "mediawiki/core": "mediawiki-core",
  "operations/deployment-charts": "operations-deployment-charts",
  "mediawiki/extensions/Wikibase": "mediawiki-extensions-Wikibase",
  "operations/dns": "operations-dns",
  "operations/cookbooks": "operations-cookbooks",
  "operations/software/homer": "operations-software-homer",
  "operations/debs/pybal": "operations-debs-pybal",
  "operations/homer/public": "operations-homer-public",
  "integration/config": "integration-config",
  "mediawiki/extensions/Cite": "mediawiki-extensions-Cite",
  "mediawiki/extensions/ORES": "mediawiki-extensions-ORES",
  "mediawiki/services/jobrunner": "mediawiki-services-jobrunner",
  "mediawiki/services/ores/deploy": "mediawiki-services-ores-deploy",
  "mediawiki/services/parsoid": "mediawiki-services-parsoid",
  "operations/alerts": "operations-alerts",
  "wikidata/query/rdf": "wikidata-query-rdf",
  "All-Projects": "All-Projects",
  "analytics/refinery": "analytics-refinery",
  "analytics/refinery/source": "analytics-refinery-source",
  "analytics/reportupdater": "analytics-reportupdater",
  "analytics/wmde/scripts": "analytics-wmde-scripts",
  "apps/android/wikipedia": "apps-android-wikipedia",
  eventlogging: "eventlogging",
  "integration/docroot": "integration-docroot",
  "integration/zuul": "integration-zuul",
  "labs/private": "labs-private",
  "labs/tools/maintain-kubeusers": "labs-tools-maintain-kubeusers",
  "maps/kartotherian/deploy": "maps-kartotherian-deploy",
  "maps/tilerator/deploy": "maps-tilerator-deploy",
  "mediawiki/extensions": "mediawiki-extensions",
  "mediawiki/extensions/Babel": "mediawiki-extensions-Babel",
  "mediawiki/extensions/CentralAuth": "mediawiki-extensions-CentralAuth",
  "mediawiki/extensions/CirrusSearch": "mediawiki-extensions-CirrusSearch",
  "mediawiki/extensions/ContentTranslation": "mediawiki-extensions-ContentTranslation",
  "mediawiki/extensions/DiscussionTools": "mediawiki-extensions-DiscussionTools",
  "mediawiki/extensions/DumpHTML": "mediawiki-extensions-DumpHTML",
  "mediawiki/extensions/EventBus": "mediawiki-extensions-EventBus",
  "mediawiki/extensions/FeaturedFeeds": "mediawiki-extensions-FeaturedFeeds",
  "mediawiki/extensions/Flow": "mediawiki-extensions-Flow",
  "mediawiki/extensions/GlobalUsage": "mediawiki-extensions-GlobalUsage",
  "mediawiki/extensions/GoToShell": "mediawiki-extensions-GoToShell",
  "mediawiki/extensions/intersection": "mediawiki-extensions-intersection",
  "mediawiki/extensions/echo": "mediawiki-extensions-echo",
  //"mediawiki/extensions/LoginNotify": "mediawiki-extensions-LoginNotify",
  "mediawiki/extensions/Math": "mediawiki-extensions-Math",
  "mediawiki/extensions/MobileFrontend": "mediawiki-extensions-MobileFrontend",
  "mediawiki/extensions/OATHAuth": "mediawiki-extensions-OATHAuth",
  "mediawiki/extensions/PageImages": "mediawiki-extensions-PageImages",
  "mediawiki/extensions/PageTriage": "mediawiki-extensions-PageTriage",
  "mediawiki/extensions/PoolCounter": "mediawiki-extensions-PoolCounter",
  "mediawiki/extensions/UserMerge": "mediawiki-extensions-UserMerge",
  "mediawiki/extensions/VipsScaler": "mediawiki-extensions-VipsScaler",
  "mediawiki/extensions/VisualEditor": "mediawiki-extensions-VisualEditor",
  "mediawiki/extensions/WikibaseQualityConstraints": "mediawiki-extensions-WikibaseQualityConstraints",
  "mediawiki/extensions/Wikidata.org": "mediawiki-extensions-Wikidata.org",
  "mediawiki/extensions/WikiEditor": "mediawiki-extensions-WikiEditor",
  "mediawiki/extensions/WikimediaMaintenance": "mediawiki-extensions-WikimediaMaintenance",
  "mediawiki/services/change-propagation/deploy": "mediawiki-services-change-propagation-deploy",
  "mediawiki/services/chromium-render": "mediawiki-services-chromium-render",
  "mediawiki/services/eventstreams": "mediawiki-services-eventstreams",
  "mediawiki/services/eventstreams/deploy": "mediawiki-services-eventstreams-deploy",
  "mediawiki/services/kartotherian": "mediawiki-services-kartotherian",
  "mediawiki/services/kask": "mediawiki-services-kask",
  "mediawiki/services/mobileapps": "mediawiki-services-mobileapps",
  "mediawiki/services/parsoid/deploy": "mediawiki-services-parsoid-deploy",
  "mediawiki/services/restbase/deploy": "mediawiki-services-restbase-deploy",
  "mediawiki/tools/code-utils": "mediawiki-tools-code-utils",
  "mediawiki/tools/release": "mediawiki-tools-release",
  "mediawiki/tools/scap": "mediawiki-tools-scap",
  "mediawiki/vagrant": "mediawiki-vagrant",
  "operations/debs/hhvm": "operations-debs-hhvm",
  "operations/debs/python-thumbor-wikimedia": "operations-debs-python-thumbor-wikimedia",
  "operations/debs/trafficserver": "operations-debs-trafficserver",
  "operations/dumps": "operations-dumps",
  "operations/puppet/mariadb": "operations-puppet-mariadb",
  "operations/software": "operations-software",
  "operations/software/conftool": "operations-software-conftool",
  "operations/software/druid_exporter": "operations-software-druid_exporter",
  "operations/software/etcd-mirror": "operations-software-etcd-mirror",
  "operations/software/gerrit": "operations-software-gerrit",
  "operations/software/homer/deploy": "operations-software-homer-deploy",
  "operations/software/klaxon": "operations-software-klaxon",
  "operations/software/nginx": "operations-software-nginx",
  "operations/software/service-checker": "operations-software-service-checker",
  "operations/software/spicerack": "operations-software-spicerack",
  "operations/software/tools-webservice": "operations-software-tools-webservice",
  "operations/software/wmfbackups": "operations-software-wmfbackups",
  "operations/software/wmfmariadbpy": "operations-software-wmfmariadbpy",
  "releng/phatality": "releng-phatality",
  "schemas/event/secondary": "schemas-event-secondary",
  "search/MjoLniR": "search-MjoLniR",
  "wikidata/query/deploy": "wikidata-query-deploy",
  "wikimedia/discovery/analytics": "wikimedia-discovery-analytics",
  "wikimedia/portals": "wikimedia-portals",
};

export type CommitLogEntry = {
  commit: string;
  author: string;
  author_email: string;
  merge?: string;
  stats?: {
    files_changed: number;
    insertions: number;
    deletions: number;
    files: string[];
    file_stats: { name: string; lines_changed: number }[];
  };
  message: string;
  epoch: number;
};
