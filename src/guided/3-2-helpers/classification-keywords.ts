// Classification categories type definition
export type ClassificationCategories = Record<string, string[]>;

// Version 1 - Initial classification keywords
export const classificationKeywordsV1: ClassificationCategories = {
  // Fix/Bug Fix keywords - most direct result of incidents
  fix: [
    'fix', 'fixes', 'fixed', 'fixing',
    'bugfix', 'bug fix',
    'patch', 'hotfix',
    'resolve', 'resolves', 'resolved', 'resolving',
    'correct', 'corrects', 'corrected', 'correcting',
    'repair', 'repairs', 'repaired', 'repairing',
    'address', 'addresses', 'addressed', 'addressing'
  ],
  
  // Refactor keywords - system improvements for resilience
  refactor: [
    'refactor', 'refactors', 'refactored', 'refactoring',
    'restructure', 'restructures', 'restructured', 'restructuring',
    'reorganize', 'reorganizes', 'reorganized', 'reorganizing',
    'cleanup', 'clean up', 'cleaned up', 'cleaning up',
    'improve', 'improves', 'improved', 'improving',
    'optimize', 'optimizes', 'optimized', 'optimizing',
    'simplify', 'simplifies', 'simplified', 'simplifying',
    'consolidate', 'consolidates', 'consolidated', 'consolidating',
    'streamline', 'streamlines', 'streamlined', 'streamlining'
  ],

  // Documentation keywords - often result from incidents revealing insufficient docs
  docs: [
    'doc', 'docs', 'documentation',
    'readme', 'readme.md',
    'comment', 'comments', 'commented', 'commenting',
    'document', 'documents', 'documented', 'documenting',
    'explain', 'explains', 'explained', 'explaining',
    'clarify', 'clarifies', 'clarified', 'clarifying'
  ],

  // Test keywords - prevent/detect improvements through better testing
  test: [
    'test', 'tests', 'tested', 'testing',
    'spec', 'specs', 
    'coverage', 'test coverage',
    'unit test', 'integration test', 'e2e test',
    'assert', 'assertion', 'assertions',
    'mock', 'mocks', 'mocked', 'mocking',
    'verify', 'verifies', 'verified', 'verifying'
  ],

  // Feature keywords - new functionality (rare but possible post-incident)  
  feat: [
    'add', 'adds', 'added', 'adding',
    'implement', 'implements', 'implemented', 'implementing',
    'introduce', 'introduces', 'introduced', 'introducing',
    'create', 'creates', 'created', 'creating',
    'new feature', 'feature',
    'support', 'supports', 'supported', 'supporting'
  ]
};

// Version 2 - Refined classification keywords based on analysis
export const classificationKeywordsV2: ClassificationCategories = {
  // Fix/Bug Fix keywords - more specific, removed overly broad terms
  fix: [
    'fix', 'fixes', 'fixed', 'fixing',
    'bugfix', 'bug fix', 'hotfix',
    'patch', 'patches', 'patched', 'patching',
    'resolve', 'resolves', 'resolved', 'resolving',
    'correct', 'corrects', 'corrected', 'correcting',
    'repair', 'repairs', 'repaired', 'repairing'
  ],
  
  // Refactor keywords - expanded to include more improvement types
  refactor: [
    'refactor', 'refactors', 'refactored', 'refactoring',
    'restructure', 'restructures', 'restructured', 'restructuring',
    'reorganize', 'reorganizes', 'reorganized', 'reorganizing',
    'cleanup', 'clean up', 'cleaned up', 'cleaning up',
    'improve', 'improves', 'improved', 'improving',
    'optimize', 'optimizes', 'optimized', 'optimizing',
    'simplify', 'simplifies', 'simplified', 'simplifying',
    'consolidate', 'consolidates', 'consolidated', 'consolidating',
    'streamline', 'streamlines', 'streamlined', 'streamlining',
    'migrate', 'migrates', 'migrated', 'migrating',
    'upgrade', 'upgrades', 'upgraded', 'upgrading',
    'modernize', 'modernizes', 'modernized', 'modernizing',
    'enhance', 'enhances', 'enhanced', 'enhancing'
  ],

  // Documentation keywords - more specific to actual documentation
  docs: [
    'readme', 'readme.md',
    'comment', 'comments', 'commented', 'commenting',
    'document', 'documents', 'documented', 'documenting',
    'documentation',
    'explain', 'explains', 'explained', 'explaining',
    'clarify', 'clarifies', 'clarified', 'clarifying',
    'describe', 'describes', 'described', 'describing'
  ],

  // Test keywords - same as v1, these seemed accurate
  test: [
    'test', 'tests', 'tested', 'testing',
    'spec', 'specs', 
    'coverage', 'test coverage',
    'unit test', 'integration test', 'e2e test',
    'assert', 'assertion', 'assertions',
    'mock', 'mocks', 'mocked', 'mocking',
    'verify', 'verifies', 'verified', 'verifying'
  ],

  // Feature keywords - much more restrictive, focus on truly new functionality
  feat: [
    'implement', 'implements', 'implemented', 'implementing',
    'introduce', 'introduces', 'introduced', 'introducing',
    'new feature', 'feature',
    'initial', 'initial commit', 'initial implementation',
    // Removed 'add', 'create', 'support' as they're too broad
    // Only include 'add' when it's clearly about new features
    'add new', 'add feature', 'add support for',
    'create new', 'create feature'
  ]
};

// Version 3 - Enhanced classification with build/maintenance category
export const classificationKeywordsV3: ClassificationCategories = {
  // Fix/Bug Fix keywords - includes error patterns and bug references
  fix: [
    'fix', 'fixes', 'fixed', 'fixing',
    'bugfix', 'bug fix', 'hotfix',
    'patch', 'patches', 'patched', 'patching',
    'resolve', 'resolves', 'resolved', 'resolving',
    'correct', 'corrects', 'corrected', 'correcting',
    'repair', 'repairs', 'repaired', 'repairing',
    // Error-related patterns
    'bug:', 't\\d+', 'error', 'crash', 'fail', 'broken',
    'workaround', 'timeout', 'exception', 'null pointer',
    // HTTP error patterns
    '400', '401', '403', '404', '500', '502', '503'
  ],
  
  // Refactor keywords - system improvements and code restructuring
  refactor: [
    'refactor', 'refactors', 'refactored', 'refactoring',
    'restructure', 'restructures', 'restructured', 'restructuring',
    'reorganize', 'reorganizes', 'reorganized', 'reorganizing',
    'cleanup', 'clean up', 'cleaned up', 'cleaning up',
    'improve', 'improves', 'improved', 'improving',
    'optimize', 'optimizes', 'optimized', 'optimizing',
    'simplify', 'simplifies', 'simplified', 'simplifying',
    'consolidate', 'consolidates', 'consolidated', 'consolidating',
    'streamline', 'streamlines', 'streamlined', 'streamlining',
    'migrate', 'migrates', 'migrated', 'migrating',
    'modernize', 'modernizes', 'modernized', 'modernizing',
    'enhance', 'enhances', 'enhanced', 'enhancing',
    // Infrastructure changes
    'switch', 'move', 'convert', 'replace', 'reconfigure',
    'switch roles', 'depool', 'repool', 'deprecate'
  ],

  // Documentation keywords - includes localisation and translation updates
  docs: [
    'readme', 'readme.md',
    'comment', 'comments', 'commented', 'commenting',
    'document', 'documents', 'documented', 'documenting',
    'documentation',
    'explain', 'explains', 'explained', 'explaining',
    'clarify', 'clarifies', 'clarified', 'clarifying',
    'describe', 'describes', 'described', 'describing',
    // Localisation and translations
    'localisation', 'localization', 'translatewiki',
    'translation', 'messages', 'i18n', 'l10n',
    // Documentation-specific
    'runbook', 'guide', 'manual', 'help'
  ],

  // Test keywords - testing and validation
  test: [
    'test', 'tests', 'tested', 'testing',
    'spec', 'specs', 
    'coverage', 'test coverage',
    'unit test', 'integration test', 'e2e test',
    'assert', 'assertion', 'assertions',
    'mock', 'mocks', 'mocked', 'mocking',
    'verify', 'verifies', 'verified', 'verifying',
    // Validation and checking
    'validate', 'validation', 'check', 'monitor'
  ],

  // Build/Maintenance keywords - dependency updates, builds, routine maintenance
  build: [
    'build:', 'updating', 'upgrade', 'upgrades', 'upgraded',
    'update', 'updates', 'updated',
    'dependency', 'dependencies', 'composer', 'npm',
    'submodule', 'submodules', 'git submodules',
    'version', 'release', 'changelog',
    // Package managers and build tools
    'package.json', 'composer.json', 'yarn', 'pip',
    'codesniffer', 'eslint', 'tox', 'phpcs',
    // Maintenance activities
    'maintenance', 'routine', 'automated',
    // Security updates
    'cve-', 'security', 'advisory', 'vulnerability'
  ],

  // Feature keywords - truly new functionality only
  feat: [
    'implement', 'implements', 'implemented', 'implementing',
    'introduce', 'introduces', 'introduced', 'introducing',
    'new feature', 'feature', 'initial',
    // Only specific 'add' cases
    'add new', 'add feature', 'add support for',
    'create new', 'create feature',
    // API and functionality
    'api', 'endpoint', 'handler', 'module'
  ]
};

// Current version - set to the latest/best performing version
export const currentClassificationKeywords = classificationKeywordsV3;