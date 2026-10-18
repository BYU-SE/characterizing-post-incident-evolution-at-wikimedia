// Sample commit messages from 4 different repositories
const testMessages = [
  // mediawiki-extensions - 95e95d0
  `Update git submodules\n\n* Update GrowthExperiments from branch 'master'\nto e02fd7de8128ee66c1a11b29b7c81046e8921f24\n- Merge \"Add an image: Consolidate logic for generating thumbnail URL\"\n- Add an image: Consolidate logic for generating thumbnail URL\n\n* Add AddImageUtils.getImageRenderData and use it to resize thumbnail URL in RecommendedImageToolbarDialog, AddImageSaveDialog, RecommendedImageViewer, AddImageArticleTarget\n* Pass the image's metadata to the save dialog to generate the thumbnail URL for the image preview\n* Constrain the image preview's aspect ratio in the save dialog\n\nBug: T297310\nChange-Id: I6636829002d8466e84593b0a7dba7cefd5ea49cd`,

  // mediawiki-extensions - fde6d42
  `Updated mediawiki/extensions\nProject: mediawiki/extensions/Wikibase  ec622726d0259079b96e3ffd89534cb2482a6455\n\nRemove unused var\n\nChange-Id: Iae3dd3bbc5b32b680d14bf63a1778f9468bfd7e3`,

  // mediawiki-extensions - 7d11901
  `Update git submodules\n\n* Update Newsletter from branch 'master'\nto 37f351776d78268863e18f9d0de72fe661c3f43a\n- Replace usage of deprecated SkinTemplateNavigation hook\n\nBug: T255319\nChange-Id: I40f9c8dd99b38ea6c255aa74598a8d42048ce032`,

  // mediawiki-extensions - 46e3204
  `Update git submodules\n\n* Update Theme from branch 'master'\nto 4d32e6b2e4b2d6726fa87457d0f3c6ff6c4a5d3d\n- build: Updating composer dependencies\n\n* mediawiki/mediawiki-phan-config: 0.10.6 → 0.11.0\n* php-parallel-lint/php-parallel-lint: 1.3.0 → 1.3.1\n\nChange-Id: I096a6011a24f01edbdf8cbba22a7da4c4644ebf1`,

  // mediawiki-extensions - 035dd41
  `Update git submodules\n\n* Update Workflows from branch 'master'\nto 00c5cf6aff8a96d80f9767175d69233668233ced\n- Improve styling details page\n\nERM27798\n\n[4.x]\n\nChange-Id: I046a6637260f2cf38317203da4681f551cdff683`,

  // mediawiki-extensions - 8dd29c7
  `Update git submodules\n\n* Update DisableAccount from branch 'master'\nto 05c5fb7ca85230edaf65d663ac652a4f4b9669e6\n- Localisation updates from https://translatewiki.net.\n\nChange-Id: I9a3fd8b7312acd8e0b59d5e30ebffed3f1555375`,

  // mediawiki-extensions - 472ff72
  `Update git submodules\n\n* Update Translate from branch 'master'\nto 2aab42a1c1e8c157b1c56c2749c1325d5c4c41c0\n- MigrateTranslatablePageSpecialPage: Add strict types\n\nBug: T299019\nChange-Id: I378cdd2d200866ab0db74f5b26ae20d912bfaadc`,

  // mediawiki-extensions - d402ad8
  `Update git submodules\n\n* Update BlueSpiceUEModulePDF from branch 'master'\nto c928161584417d547b4fd669b390178a77e4de3a\n- Localisation updates from https://translatewiki.net.\n\nChange-Id: I19eed32441b8d0222f4182c3f895d78c41f6923d`,

  // mediawiki-extensions - a0755ac
  `Update git submodules\n\n* Update BlueSpiceExtendedSearch from branch 'master'\nto 089aa4897984457fbe86d579d8890020b0fb1d7f\n- Localisation updates from https://translatewiki.net.\n\nChange-Id: Ic45e3fc52c3e21add8d86b6ff72783d0f1ff15a0`,

  // mediawiki-extensions - 8e48da3
  `Update git submodules\n\n* Update AccountInfo from branch 'REL1_35'\nto 75963664da11e531ae3f5a0105e251d7efe38d58\n- build: Updating dependencies\n\ncomposer:\n* mediawiki/mediawiki-codesniffer: 31.0.0 → 38.0.0\nThe following sniffs are failing and were disabled:\n* MediaWiki.Commenting.FunctionComment.UppercasePrimitiveStringReturn\n\nnpm:\n* async: 3.2.0 → 3.2.3\n* https://github.com/advisories/GHSA-fwr7-v2mv-hh25\n\nAdditional changes:\n* Dropped default excluded folder(s) from .phpcs.xml (T274684).\n* composer.json: Updated phpcs command in composer test (T280592).\n* composer.json: Added phpcs command to scripts (T280592).\n\nChange-Id: Ib2721b5b1467e1507bc150c6d5a2d4499aa72d90`,

  // mediawiki-extensions - a4adcab
  `Update git submodules\n\n* Update TranslateSvg from branch 'REL1_35'\nto 769125d3069826e5c13cbdfed6d6c04bded0edbf\n- Localisation updates from https://translatewiki.net.\n\nChange-Id: I988122ffe2d93626426ac806e94ed9182ee538d0`,

  // mediawiki-extensions - 5e7de68
  `Update git submodules\n\n* Update WikiLove from branch 'master'\nto e7095b2b3f20bfc95ce8cf3c6b8fc934fc38dc60\n- Localisation updates from https://translatewiki.net.\n\nChange-Id: I37ca306dda69fd819cfb0c4a8d1f43b5d476c649`,

  // operations-puppet - e967284
  `moved fundraising udplog collection to its own script\n\nChange-Id: Ie9f4997744a90733f64ef833217fc6a0fac7aa42`,

  // operations-puppet - 8ede4f5
  `releases-jenkins: expect status code 401 or 403\n\nThis host is behind a reverse proxy, let's test\nthe actual webserver behind it, on port 8080.\n\nThere is no reason to force IPv4.\n\nWhen using curl manually from prometheus hosts this\ngets a 401, when it's done by the prometheus check we get a 403.\n\nAccept both.\n\nBug: T327975\nChange-Id: I1e8eb6fb7a7193f20d63636efc3d36f02298e2bc`,

  // operations-puppet - 8ecf659
  `ceph: filter out also dbgsym packages\n\nThe new repo also has debugging symbols indexed, but some of the\npackages are not really there, so we can skip them as we don't need\nthem.\n\nBug: T309786\nSigned-off-by: David Caro <dcaro@wikimedia.org>\nChange-Id: Ie1d9bc9e0828b72d59b43fa646e5c3aeb6a9202e`,

  // operations-puppet - ea05773
  `db1107: Disable notifications\n\nOn-site maintenance required.\n\nChange-Id: I1097986d494edfe4c611339e3cb3086d4ecbfdb8`,

  // operations-puppet - c031024
  `prometheus: Drop absented cron\n\nThis cron was absent in I6e6e118d5e741 (merged in May 26). It's safe to\nremove it now.\n\nBug: T273673\nChange-Id: I12dbdb46d6d2c7041395987cf9e3875366fe8871`,

  // operations-puppet - cc78188
  `gitlab_runner: unregister gitlab-runner2004 for dockerfile conversion\n\nThis change removes gitlab-runner2004 from the pool of Trusted Runners.\nAfter depooling this runner can be configured as a special purpose\nDockerfile runner.\n\nBug: T357612\nChange-Id: Iec889a9d6332b6fea1fb1d6e88114c54444f8014`,

  // operations-puppet - 2b54b9f
  `P:wmcs::kubeadm::control: monitor cert expiration\n\nBug: T324182\nChange-Id: I3d396133ffa2ddffa82b8e99ed3954af9bf3e827`,

  // operations-puppet - 8593aaf
  `Add puppet configuration for matomo1002\n\nBug: T252742\nChange-Id: I3b60aa14197ba1c0686179eea966fe0b93a2f954`,

  // operations-puppet - 82427f6
  `mariadb: Switch db1114 and db1118 roles\n\ndb1114 has crashed several times. Pool db1118 with its role, and\nset db1114 as a testing host, where it being less reliable is not\nas critical (an s1 host crashing is very traumatic and\ntask-intensive).\n\nBug: T214720\nChange-Id: If165fec9ad5baabea1168f81827f2ecdd3730406`,

  // operations-puppet - 79932d4
  `openstack: queens: apt pin systemd harder\n\nRaise the pin priority to workaround version clashes.\n\nBug: T247013\nChange-Id: I75be09adecbc4d19cd3dc764d9065e453c87ed5d\nSigned-off-by: Arturo Borrero Gonzalez <aborrero@wikimedia.org>`,

  // operations-puppet - 5472d5b
  `installserver: add icinga runbook for tftpd down\n\nNew runbook page created for this at\n\nhttps://wikitech.wikimedia.org/wiki/Monitoring/atftpd\n\nBug: T197873\nChange-Id: Ife3dd73c31d0ba601b8ecd58c7e31b92f8f46eb7`,

  // operations-puppet - d35b09f
  `wikireplica: depool clouddbb1014\n\nBug: T273281\nChange-Id: Ic82ee96f49b22c17000595657a4fa8e0cf7d612c`,

  // mediawiki-core - a8cb684
  `Update git submodules\n\n* Update extensions/Echo from branch 'REL1_41'\nto 18ee1ce1c604dcbb39753a1141b420f13b87a7c3\n- Localisation updates from https://translatewiki.net.\n\nChange-Id: I844741053fce8984796614f5f4d9258548b396ee`,

  // mediawiki-core - 016cd22
  `* Aromanian (roa-rup) messages`,

  // mediawiki-core - d6b1f91
  `Update git submodules\n\n* Update extensions/Scribunto from branch 'REL1_39'\nto cc7f7b7d1d00e40d762f931a39249d2db7586eb0\n- Localisation updates from https://translatewiki.net.\n\nChange-Id: I6b55e12142e3c7f7ac5b740a31bf2337c5b3e3a4`,

  // mediawiki-core - 9da4944
  `Rest: Use SelectQueryBuilder in LanguageLinksHandler\n\nAnd select only the fields we want instead of * (effectively excluding\nll_from).\n\nBug: T311866\nChange-Id: Ibae16e34cf525a4581503b59bc533a2db2bc9dd7`,

  // mediawiki-core - fb39147
  `Type hint against IResultWrapper\n\nIDatabase::select returns the interface IResultWrapper,\nnot the implementation ResultWrapper\n\nChange-Id: I8904eff2db48ff00a4a9486be842266c638bc249`,

  // mediawiki-core - a468534
  `RecentChanges: Add process caching to RecentChanges UserLinks and Tags parsing\n\nRendering UserLinks or Tags requires parsing, which when run on thousands of records, adds up to a significant amount of processing time. More often than not, this can be optimized by storing already visited tags or user links as those \"renders\" will not change for the single request run and are repeated constantly on the list.\n\nBug: T341319\nChange-Id: I91588aebae7e49e3d3cb77702cf28677b4a14c8d`,

  // mediawiki-core - 6deb151
  `Update git submodules\n\n* Update extensions/CategoryTree from branch 'REL1_43'\nto 222a0acadbb759487382919c66db690ef4ff9c32\n- build: Updating nanoid to 3.3.8\n\n* https://github.com/advisories/GHSA-mwcw-c2x4-8c55\n\nChange-Id: Ia6009a03e756c2d8a2336caba9b78c2598b1fcd6`,

  // mediawiki-core - 418f78c
  `Use a standard tab width when editfont is used\n\nThis aligns the tab-width with other editors/viewers,\nsuch as 2017WTE, VE, CodeEditor and SyntaxhHighlight.\n\nChange-Id: I15ac4a8a4d40ec1bb2adbf64c16e747b2e154760`,

  // mediawiki-core - 6a902dc
  `RecentChange: Cast rev_id attr value to integer\n\nRevisionRecord::getId() returns int|null, and the null\ncan likely reach here via PageUpdater::doModify() or\nfrom somewhere else.\n\nRecentChange::diffLinkTrail() already casts it to integer.\n\nBug: T274748\nChange-Id: I42acdcedf8ac8d1caa1ce41758a670d90e43f58a`,

  // mediawiki-core - 03286a8
  `Localisation updates from https://translatewiki.net.\n\nChange-Id: I239dad37beadc1674eeb7611604f236f38d0f8e3`,

  // mediawiki-core - a822b39
  `Blocks: Misc changes\n\n* Removed un-used property\n* Simplified return value and swift statement\n\nChange-Id: I57db9d2f160bec5d9ae8afd6805e7ce07daf63c1`,

  // mediawiki-core - 94969db
  `build: Upgrade mediawiki-codesniffer to v29.0.0\n\nAlso update composer/spdx-licenses from 1.5.1 to 1.5.2\n\nDisable the new rules, for now, as they're a bit noisy to auto-fix all\nat once.\n\nChange-Id: I2c6a92f5230096adf58f4863f86e3d6ce8ca1a9d`,

  // operations-software-spicerack - 82fcd12
  `elasticsearch: add https:// to relforge endpoints\n\nWhile trying to use spicerack with the 'relforge' cluster I noticed\nthat every operation ends up in:\n\n\"400 The plain HTTP request was sent to HTTPS port\"\n\nChange-Id: I219ad3379217134d78f839c98a6231a03ff38560`,

  // operations-software-spicerack - 1eb201f
  `setup.py: add long description\n\nBug: T199079\nChange-Id: I569e9299e60c2819551feca159cbe859858d7b77`,

  // operations-software-spicerack - dec59f5
  `mediawiki: fix Remote queries for maintenance host\n\nBug: T199079\nChange-Id: I2bda58ad9e9c7768a656d313702f46002e01e36e`,

  // operations-software-spicerack - a9b2ef6
  `config: directly inject global config path\n\nBug: T199079\nChange-Id: Iec021cb4e547d85528c36f851e33ee34db0d432f`,

  // operations-software-spicerack - 3d60130
  `cookbook: allow to pass parameters in the menu\n\n* Allow to pass parameters to menu and cookbooks via the interactive\nmenu. They override the ones passed to the parent level or the CLI\nwhen instantiating the menu.\n* Print the current arguments in each menu title, so that is clear which\narguments will be passed to the cookbooks if non overriden.\n\nBug: T199079\nChange-Id: Ief1e6125d0b439a0491acfb3f0eca7d30920da59`,

  // operations-software-spicerack - ffdc7a7
  `Upstream release v0.0.5\n\nBug: T199079\nChange-Id: Id016c75f011d257a29664be9d495578eaa6bbec7`,

  // operations-software-spicerack - f451339
  `mediawiki: improve validation checks\n\n* Refactor check_siteinfo() to accept multiple items to check in\nsiteinfo and move the retries to linear with more tries for a quicker\nsuccess path in the general case.\n* Iterate check_siteinfo requests to pick more random servers from the\nload balancer and empirically ensure that most of the fleet has picked\nthe update value.\n* Given that some keys in siteinfo might not be present, do not fail if\nthe key is missing in dry-run mode, as the verified key might depend\non a change that was not applied because of the dry-run.\n\nBug: T199079\nChange-Id: I264e9938a12d0a02a5b12f129d6e90028e6a9ba3`,

  // operations-software-spicerack - 28d9d87
  `Initial structure\n\n* Add initial boilerplace of the repository.\n* Add initial module structure.\n* Add initial tests structure and configuration.\n\nBug: T199079\nChange-Id: I115cce1daabd86b3463732820246fd1800a82bcb`,

  // operations-software-spicerack - 118517b
  `Add MediaWiki module to manipulate its config\n\nBug: T199079\nChange-Id: Idc62576461f1f5bf9c6853cedc5a274b06c4b6be`,

  // operations-software-spicerack - 764032b
  `cookbook: fix links to parent in interactive menu\n\n* Fix condition to add the parent menu when a path filter is used.\n\nBug: T199079\nChange-Id: I78997d4c70efbbcca18b23e1dc7bcc2a3c4390f6`,

  // operations-software-spicerack - acaae16
  `Add a retry decorator\n\n* Add a retry decorator that allow to retry the call of the decorated\nfunction or method if it raises any of the selected exceptions.\n* The retries are delayed with a configurable backoff, also the number\nof retries is configurable.\n* The available backoff strategies are: constant, linear, power and\nexponential.\n* The decorator can be used without any arguments (@retry), in which\ncase it will use its default values, or can be called with arguments\nto customize its behaviour (@retry(argname=value))\n\nBug: T199079\nChange-Id: I372624f44f232f2d5863f3c843614593b5264673`,

  // operations-software-spicerack - ad20be1
  `Change package name for PyPI\n\n* Given the Wikimedia-specific nature of this package, change the name\nto be used to publish it on PyPI. Having the package on PyPI is\nnecessary to have dependent tools testing it with CI or locally.\n\nBug: T199079\nChange-Id: I54147ed35eca8a87c49000253f855c26baecd232`
];

export default testMessages;