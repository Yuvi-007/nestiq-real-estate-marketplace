import { FileCheck2, Trash2, UploadCloud } from 'lucide-react'
import { useState } from 'react'
import { useController, useWatch } from 'react-hook-form'

import { uploadService } from '../../services/api'
import Button from '../ui/Button'
import Input from '../ui/Input'

const documentTypes = [
  { value: 'ownership', label: 'Ownership document' },
  { value: 'taxReceipt', label: 'Tax receipt' },
  { value: 'utilityBill', label: 'Utility bill' },
  { value: 'idProof', label: 'ID proof' },
  { value: 'other', label: 'Other' },
]

const maxDocuments = 10

function PropertyVerificationStep({ control }) {
  const [documentType, setDocumentType] = useState('ownership')
  const [uploadError, setUploadError] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const documents = useWatch({ control, name: 'verificationDocuments' }) || []
  const { field } = useController({ control, name: 'verificationDocuments' })

  const uploadFiles = async (fileList) => {
    const files = Array.from(fileList || [])

    if (files.length === 0) return
    if (documents.length + files.length > maxDocuments) {
      setUploadError(`You can upload a maximum of ${maxDocuments} verification documents.`)
      return
    }

    setUploadError('')
    setIsUploading(true)

    try {
      const response = await uploadService.uploadVerificationDocuments(files)
      const nextDocuments = (response.documents || []).map((document) => ({
        ...document,
        type: documentType,
        status: 'submitted',
      }))

      field.onChange([...(field.value || []), ...nextDocuments])
    } catch (error) {
      setUploadError(error.response?.data?.message || error.message || 'Unable to upload verification documents')
    } finally {
      setIsUploading(false)
    }
  }

  const removeDocument = (publicId) => {
    field.onChange((field.value || []).filter((document) => document.publicId !== publicId))
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-bold text-primary">Optional property verification</p>
        <p className="mt-1 text-xs font-semibold leading-5 text-slate-500">
          Upload ownership, tax, utility, ID, or supporting documents. Admins can review these privately. Public users only see verification status.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
        <Input as="select" label="Document type" value={documentType} onChange={(event) => setDocumentType(event.target.value)}>
          {documentTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
        </Input>
        <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-extrabold text-white transition hover:bg-charcoal">
          <UploadCloud size={16} />
          {isUploading ? 'Uploading...' : 'Upload documents'}
          <input
            type="file"
            accept="application/pdf,image/jpeg,image/jpg,image/png,image/webp"
            multiple
            disabled={isUploading}
            onChange={(event) => {
              uploadFiles(event.target.files)
              event.target.value = ''
            }}
            className="sr-only"
          />
        </label>
      </div>

      {uploadError && (
        <div className="rounded-2xl border border-danger/20 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
          {uploadError}
        </div>
      )}

      {documents.length > 0 ? (
        <div className="grid gap-3">
          {documents.map((document) => (
            <div key={document.publicId} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-surface p-4">
              <p className="flex min-w-0 items-center gap-3 text-sm font-semibold text-slate-700">
                <FileCheck2 size={17} className="shrink-0 text-success" />
                <span className="truncate">{document.type} document uploaded</span>
              </p>
              <Button variant="secondary" size="sm" icon={Trash2} onClick={() => removeDocument(document.publicId)} className="hover:border-danger hover:text-danger">
                Remove
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-slate-300 bg-surface px-4 py-4 text-sm font-semibold text-slate-600">
          No verification documents uploaded yet. You can still publish and submit documents later.
        </p>
      )}
    </div>
  )
}

export default PropertyVerificationStep
