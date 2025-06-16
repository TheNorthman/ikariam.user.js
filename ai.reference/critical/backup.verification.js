/**
 * === BACKUP VERIFICATION SYSTEM ===
 * Purpose: Ensure backup integrity and rebuild trust in backup system
 * Status: REQUIRED - No backup operations without verification
 * Date: 2025-06-16
 */

const BACKUP_VERIFICATION = {
    /**
     * Verify backup file matches source file exactly
     */
    verifyBackup(sourceFile, backupFile) {
        const verification = {
            passed: false,
            results: {
                fileExists: false,
                sizeMatch: false,
                lineCountMatch: false,
                contentMatch: false,
                criticalFunctionsPresent: false
            },
            details: {
                sourceSize: 0,
                backupSize: 0,
                sourceLines: 0,
                backupLines: 0,
                missingFunctions: [],
                contentDifferences: []
            }
        };

        // Check if backup file exists
        verification.results.fileExists = this.fileExists(backupFile);
        if (!verification.results.fileExists) {
            verification.details.contentDifferences.push("Backup file was not created");
            return verification;
        }

        // Compare file sizes
        verification.details.sourceSize = this.getFileSize(sourceFile);
        verification.details.backupSize = this.getFileSize(backupFile);
        verification.results.sizeMatch = (verification.details.sourceSize === verification.details.backupSize);

        // Compare line counts
        verification.details.sourceLines = this.getLineCount(sourceFile);
        verification.details.backupLines = this.getLineCount(backupFile);
        verification.results.lineCountMatch = (verification.details.sourceLines === verification.details.backupLines);

        // Compare content
        verification.results.contentMatch = this.compareContent(sourceFile, backupFile);
        if (!verification.results.contentMatch) {
            verification.details.contentDifferences = this.getContentDifferences(sourceFile, backupFile);
        }

        // Check critical functions
        const criticalCheck = this.verifyCriticalFunctions(backupFile);
        verification.results.criticalFunctionsPresent = criticalCheck.allPresent;
        verification.details.missingFunctions = criticalCheck.missing;

        // Overall verification result
        verification.passed = 
            verification.results.fileExists &&
            verification.results.sizeMatch &&
            verification.results.lineCountMatch &&
            verification.results.contentMatch &&
            verification.results.criticalFunctionsPresent;

        return verification;
    },

    /**
     * Critical functions that must be present in backup
     */
    criticalFunctions: [
        'tnt.tableBuilder.buildResourceTable',
        'tnt.tableBuilder.buildBuildingTable', 
        'tnt.tableBuilder.attachEventHandlers',
        'tnt.citySwitcher.start',
        'tnt.citySwitcher.nextCity',
        'tnt.citySwitcher.end',
        'tnt.dataCollector.update',
        'tnt.dataCollector.show',
        'tnt.calc.production',
        'tnt.has.construction'
    ],

    /**
     * Verify critical functions exist in backup file
     */
    verifyCriticalFunctions(backupFile) {
        const content = this.readFile(backupFile);
        const missing = [];

        this.criticalFunctions.forEach(func => {
            // Simple check for function presence
            const functionPattern = new RegExp(func.replace(/\./g, '\\.'), 'i');
            if (!functionPattern.test(content)) {
                missing.push(func);
            }
        });

        return {
            allPresent: missing.length === 0,
            missing: missing
        };
    },

    /**
     * Format verification results for command output
     */
    formatVerificationReport(verification, sourceFile, backupFile) {
        let report = "**Verification Results**:\n";

        // File existence
        const existsIcon = verification.results.fileExists ? "✅" : "❌";
        report += `${existsIcon} **File created**: ${verification.results.fileExists ? "SUCCESS" : "FAILED"}\n`;

        // Size comparison - use actual detected sizes, not hard-coded values
        const sizeIcon = verification.results.sizeMatch ? "✅" : "❌";
        const sizeDetails = verification.results.sizeMatch ? "MATCH" : 
            `MISMATCH (${this.formatBytes(verification.details.sourceSize)} → ${this.formatBytes(verification.details.backupSize)})`;
        report += `${sizeIcon} **File size**: ${this.formatBytes(verification.details.sourceSize)} → ${this.formatBytes(verification.details.backupSize)} (${sizeDetails})\n`;

        // Line count comparison - use actual detected counts
        const lineIcon = verification.results.lineCountMatch ? "✅" : "❌";
        const lineDetails = verification.results.lineCountMatch ? "MATCH" : 
            `MISMATCH (${verification.details.sourceLines} → ${verification.details.backupLines})`;
        report += `${lineIcon} **Line count**: ${verification.details.sourceLines} → ${verification.details.backupLines} (${lineDetails})\n`;

        // Content comparison
        const contentIcon = verification.results.contentMatch ? "✅" : "❌";
        report += `${contentIcon} **Content**: ${verification.results.contentMatch ? "IDENTICAL" : "DIFFERENCES FOUND"}\n`;

        // Critical functions
        const functionsIcon = verification.results.criticalFunctionsPresent ? "✅" : "❌";
        report += `${functionsIcon} **Critical functions**: ${verification.results.criticalFunctionsPresent ? "ALL PRESENT" : "MISSING FUNCTIONS"}\n`;

        // Overall result
        const overallIcon = verification.passed ? "🎯" : "🚨";
        const overallStatus = verification.passed ? "PASSED" : "FAILED";
        report += `\n${overallIcon} **VERIFICATION: ${overallStatus}** - Backup is ${verification.passed ? "identical to" : "NOT identical to"} source\n`;

        // Show specific issues if verification failed
        if (!verification.passed) {
            report += "\n**Issues Found**:\n";
            
            if (verification.details.missingFunctions.length > 0) {
                report += "❌ **Missing functions**: " + verification.details.missingFunctions.join(", ") + "\n";
            }
            
            if (verification.details.contentDifferences.length > 0) {
                report += "❌ **Content differences**: " + verification.details.contentDifferences.slice(0, 5).join(", ");
                if (verification.details.contentDifferences.length > 5) {
                    report += ` (and ${verification.details.contentDifferences.length - 5} more...)`;
                }
                report += "\n";
            }
        }

        return report;
    },

    /**
     * Helper methods (would be implemented based on environment)
     */
    fileExists(filePath) {
        // Implementation depends on environment (Node.js fs, browser File API, etc.)
        return true; // Placeholder
    },

    getFileSize(filePath) {
        // Return file size in bytes
        return 0; // Placeholder
    },

    getLineCount(filePath) {
        // Return number of lines in file
        return 0; // Placeholder
    },

    compareContent(sourceFile, backupFile) {
        // Return true if files are identical
        return true; // Placeholder
    },

    getContentDifferences(sourceFile, backupFile) {
        // Return array of differences
        return []; // Placeholder
    },

    readFile(filePath) {
        // Return file content as string
        return ""; // Placeholder
    },

    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }
};

/**
 * Usage Example:
 * 
 * // Verify backup dynamically - no hard-coded expectations
 * const verification = BACKUP_VERIFICATION.verifyBackup(
 *     'dev/tnt.collection.core.user.js',
 *     'backup/core/tnt.collection.core.{date}.{running number}.user.js'
 * );
 * 
 * // Report uses actual file metrics, not documentation assumptions
 * const report = BACKUP_VERIFICATION.formatVerificationReport(
 *     verification,
 *     'dev/tnt.collection.core.user.js',
 *     'backup/core/tnt.collection.core.{date}.{running number}.user.js'
 * );
 * 
 * console.log(report);
 */
