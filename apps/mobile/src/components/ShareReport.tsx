import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, Share, Linking } from 'react-native'
import * as Clipboard from 'expo-clipboard'
import { ExpensesAPI } from '@api'

export const ShareReport: React.FC = () => {
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const expensesAPI = new ExpensesAPI()

  const generateShareableReport = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      
      const report = await expensesAPI.generateShareableReport()
      // For mobile, we'll use a placeholder URL since we don't have window.location
      const url = `https://your-domain.com/shared-report/${report.id}`
      setShareUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    if (!shareUrl) return
    
    try {
      await Clipboard.setStringAsync(shareUrl)
      Alert.alert('Success', 'Link copied to clipboard!')
    } catch (err) {
      Alert.alert('Error', 'Failed to copy link to clipboard')
    }
  }

  const shareViaOS = async () => {
    if (!shareUrl) return

    try {
      await Share.share({
        message: 'Check out my expense report: ' + shareUrl,
        url: shareUrl,
        title: 'My Expense Report'
      })
    } catch (err) {
      // User cancelled sharing or error occurred
      console.log('Share cancelled or failed:', err)
    }
  }

  const openInBrowser = async () => {
    if (!shareUrl) return

    try {
      await Linking.openURL(shareUrl)
    } catch (err) {
      Alert.alert('Error', 'Failed to open link')
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>📤 Share Expense Report</Text>
      
      <Text style={styles.description}>
        Generate a shareable link to your expense summary that you can send to friends, 
        family, or team members. The shared report includes your total spending and 
        category breakdown.
      </Text>

      {error && (
        <View style={styles.errorCard}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!shareUrl ? (
        <TouchableOpacity
          style={styles.generateButton}
          onPress={generateShareableReport}
          disabled={isGenerating}
        >
          <Text style={styles.generateButtonText}>
            {isGenerating ? 'Generating Report...' : 'Generate Shareable Report'}
          </Text>
        </TouchableOpacity>
      ) : (
        <View>
          <View style={styles.urlContainer}>
            <Text style={styles.urlText} numberOfLines={3}>
              {shareUrl}
            </Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={copyToClipboard}
            >
              <Text style={styles.secondaryButtonText}>📋 Copy</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.primaryButton]}
              onPress={shareViaOS}
            >
              <Text style={styles.primaryButtonText}>📱 Share</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.secondaryButton]}
              onPress={openInBrowser}
            >
              <Text style={styles.secondaryButtonText}>🌐 Open</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.disclaimer}>
            This link will remain active and show your current expense data
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333'
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    lineHeight: 20
  },
  errorCard: {
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16
  },
  errorText: {
    color: '#dc3545',
    fontSize: 14,
    textAlign: 'center'
  },
  generateButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center'
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600'
  },
  urlContainer: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e1e5e9'
  },
  urlText: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#333'
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12
  },
  button: {
    flex: 1,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center'
  },
  primaryButton: {
    backgroundColor: '#007AFF'
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600'
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd'
  },
  secondaryButtonText: {
    color: '#666',
    fontSize: 14
  },
  disclaimer: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  }
})
