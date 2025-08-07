'use client'

import React, { useState } from 'react'
import { expensesAPI } from '@api'
import styles from './ShareReport.module.css'

export const ShareReport: React.FC = () => {
  const [shareUrl, setShareUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generateShareableReport = async () => {
    try {
      setIsGenerating(true)
      setError(null)
      
      const report = await expensesAPI.generateShareableReport()
      const url = `${window.location.origin}/shared-report/${report.id}`
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
      await navigator.clipboard.writeText(shareUrl)
      alert('Link copied to clipboard!')
    } catch (err) {

      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Link copied to clipboard!')
    }
  }

  const shareViaWebAPI = async () => {
    if (!shareUrl || typeof navigator === 'undefined' || !navigator.share) return

    try {
      await navigator.share({
        title: 'My Expense Report',
        text: 'Check out my expense report',
        url: shareUrl
      })
    } catch {

      console.log('Share cancelled or failed')
    }
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        📤 Share Expense Report
      </h3>
      
      <p className={styles.description}>
        Generate a shareable link to your expense summary that you can send to friends, 
        family, or team members. The shared report includes your total spending and 
        category breakdown.
      </p>

      {error && (
        <div className={styles.errorContainer}>
          {error}
        </div>
      )}

      {!shareUrl ? (
        <button
          onClick={generateShareableReport}
          disabled={isGenerating}
          className={styles.generateButton}
        >
          {isGenerating ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              Generating Report...
            </div>
          ) : (
            'Generate Shareable Report'
          )}
        </button>
      ) : (
        <div className={styles.shareContainer}>
          <div className={styles.urlContainer}>
            {shareUrl}
          </div>

          <div className={`${styles.buttonGrid} ${(typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'share' in navigator) ? styles.buttonGridTwoColumns : styles.buttonGridOneColumn}`}>
            <button
              onClick={copyToClipboard}
              className={styles.copyButton}
            >
              📋 Copy Link
            </button>

            {(typeof window !== 'undefined' && typeof navigator !== 'undefined' && 'share' in navigator) && (
              <button
                onClick={shareViaWebAPI}
                className={styles.shareButton}
              >
                📱 Share
              </button>
            )}
          </div>

          <div className={styles.disclaimer}>
            This link will remain active and show your current expense data
          </div>
        </div>
      )}
    </div>
  )
}
