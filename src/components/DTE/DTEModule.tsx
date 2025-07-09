"use client"

import type React from "react"
import { useState } from "react"
import {
  FileText,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Download,
  RefreshCw,
  Ban,
  AlertTriangle,
} from "lucide-react"
import { useData } from "../../contexts/DataContext"
import { useToast } from "../../contexts/ToastContext"
import type { DTEDocument } from "../../types"
import DTEEventModal from "./DTEEventModals"

const DTEModule: React.FC = () => {
  const { dteDocuments, updateDTEDocument } = useData()
  const { addToast } = useToast()
  const [selectedDocument, setSelectedDocument] = useState<DTEDocument | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [eventType, setEventType] = useState<"invalidate" | "contingency" | "resend">("resend")

  const statusConfig = {
    enviado: {
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      label: "Enviado",
    },
    procesando: {
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      label: "Procesando",
    },
    pendiente: {
      icon: AlertCircle,
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      label: "Pendiente",
    },
    rechazado: {
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      label: "Rechazado",
    },
  }

  const getStatusCounts = () => {
    const counts = dteDocuments.reduce(
      (acc, doc) => {
        acc[doc.status] = (acc[doc.status] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )
    return {
      enviado: counts.enviado || 0,
      procesando: counts.procesando || 0,
      pendiente: counts.pendiente || 0,
      rechazado: counts.rechazado || 0,
    }
  }

  const counts = getStatusCounts()

  // Función para determinar qué acciones están disponibles según el estado
  const getAvailableActions = (document: DTEDocument): string[] => {
    const baseActions = ["download"] // Siempre se puede descargar

    switch (document.status) {
      case "enviado":
        // Solo los DTEs enviados (procesados) se pueden invalidar
        return [...baseActions, "invalidate", "resend"]

      case "rechazado":
      case "pendiente":
        // Los DTEs rechazados o pendientes solo pueden marcarse como contingencia
        return [...baseActions, "contingency"]

      case "procesando":
        // Los DTEs en procesamiento solo se pueden reenviar
        return [...baseActions, "resend"]

      default:
        return baseActions
    }
  }

  const handleResendDTE = (document: DTEDocument) => {
    setSelectedDocument(document)
    setEventType("resend")
    setModalOpen(true)
  }

  const handleInvalidateDTE = (document: DTEDocument) => {
    // Validación adicional por seguridad
    if (document.status !== "enviado") {
      addToast({
        type: "error",
        title: "Acción no permitida",
        message: "Solo se pueden invalidar DTEs que han sido procesados correctamente",
      })
      return
    }

    setSelectedDocument(document)
    setEventType("invalidate")
    setModalOpen(true)
  }

  const handleContingencyDTE = (document: DTEDocument) => {
    // Validación adicional por seguridad
    if (!["rechazado", "pendiente"].includes(document.status)) {
      addToast({
        type: "error",
        title: "Acción no permitida",
        message: "Solo se pueden marcar como contingencia los DTEs rechazados o pendientes",
      })
      return
    }

    setSelectedDocument(document)
    setEventType("contingency")
    setModalOpen(true)
  }

  const handleEventConfirm = (document: DTEDocument, data?: any) => {
    switch (eventType) {
      case "invalidate":
        if (document.status !== "enviado") {
          addToast({
            type: "error",
            title: "Error de validación",
            message: "Solo se pueden invalidar DTEs procesados",
          })
          return
        }
        updateDTEDocument(document.id, { status: "rechazado" })
        addToast({
          type: "warning",
          title: "DTE Invalidado",
          message: `El documento ${document.documentNumber} ha sido invalidado`,
        })
        break

      case "contingency":
        if (!["rechazado", "pendiente"].includes(document.status)) {
          addToast({
            type: "error",
            title: "Error de validación",
            message: "Solo se pueden marcar como contingencia los DTEs rechazados o pendientes",
          })
          return
        }
        updateDTEDocument(document.id, { status: "pendiente" })
        addToast({
          type: "warning",
          title: "DTE en Contingencia",
          message: `El documento ${document.documentNumber} ha sido marcado como contingencia`,
        })
        break

      case "resend":
        updateDTEDocument(document.id, { status: "procesando" })
        addToast({
          type: "info",
          title: "DTE Reenviado",
          message: `El documento ${document.documentNumber} ha sido reenviado al MH`,
        })
        break
    }
  }

  const handleDownloadDTE = (document: DTEDocument) => {
    // Simulate download
    const element = document.createElement("a")
    element.href =
      "data:application/pdf;base64,JVBERi0xLjQKJdPr6eEKMSAwIG9iago8PC9UeXBlL0NhdGFsb2cvUGFnZXMgMiAwIFI+PgplbmRvYmoKMiAwIG9iago8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvTWVkaWFCb3hbMCAwIDU5NSA4NDJdL1BhcmVudCAyIDAgUi9SZXNvdXJjZXM8PC9Gb250PDwvRjEgNCAwIFI+Pj4+L0NvbnRlbnRzIDUgMCBSPj4KZW5kb2JqCjQgMCBvYmoKPDwvVHlwZS9Gb250L1N1YnR5cGUvVHlwZTEvQmFzZUZvbnQvSGVsdmV0aWNhPj4KZW5kb2JqCjUgMCBvYmoKPDwvTGVuZ3RoIDQ0Pj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihEVEUgRE9DVU1FTlQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmCjAwMDAwMDAwMDkgMDAwMDAgbgowMDAwMDAwMDU4IDAwMDAwIG4KMDAwMDAwMDExNSAwMDAwMCBuCjAwMDAwMDAyNDUgMDAwMDAgbgowMDAwMDAwMzA3IDAwMDAwIG4KdHJhaWxlcgo8PC9TaXplIDYvUm9vdCAxIDAgUj4+CnN0YXJ0eHJlZgo0MDIKJSVFT0Y="
    element.download = `DTE-${document.documentNumber}.pdf`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)

    addToast({
      type: "success",
      title: "Descarga iniciada",
      message: `Descargando documento ${document.documentNumber}`,
    })
  }

  const renderActionButton = (document: DTEDocument, action: string) => {
    switch (action) {
      case "resend":
        return (
          <button
            onClick={() => handleResendDTE(document)}
            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Reenviar DTE"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )
      case "invalidate":
        return (
          <button
            onClick={() => handleInvalidateDTE(document)}
            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Invalidar DTE (Solo DTEs procesados)"
          >
            <Ban className="w-4 h-4" />
          </button>
        )
      case "contingency":
        return (
          <button
            onClick={() => handleContingencyDTE(document)}
            className="p-1 text-yellow-600 hover:bg-yellow-50 rounded transition-colors"
            title="Marcar como Contingencia (Solo DTEs rechazados o pendientes)"
          >
            <AlertTriangle className="w-4 h-4" />
          </button>
        )
      case "download":
        return (
          <button
            onClick={() => handleDownloadDTE(document)}
            className="p-1 text-gray-600 hover:bg-gray-50 rounded transition-colors"
            title="Descargar DTE"
          >
            <Download className="w-4 h-4" />
          </button>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Documentos Tributarios Electrónicos (DTE)</h2>
        </div>
      </div>

      {/* Información de reglas de negocio */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="text-sm font-medium text-blue-800">Reglas de Gestión DTE</h4>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>
                • <strong>Invalidación:</strong> Solo disponible para DTEs procesados (enviados)
              </li>
              <li>
                • <strong>Contingencia:</strong> Solo disponible para DTEs rechazados o pendientes
              </li>
              <li>
                • <strong>Reenvío:</strong> Disponible para DTEs enviados y en procesamiento
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(statusConfig).map(([status, config]) => {
          const Icon = config.icon
          const count = counts[status as keyof typeof counts]

          return (
            <div key={status} className={`${config.bgColor} ${config.borderColor} border rounded-lg p-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{config.label}</p>
                  <p className="text-2xl font-bold text-gray-800">{count}</p>
                </div>
                <Icon className={`w-8 h-8 ${config.color}`} />
              </div>
            </div>
          )
        })}
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Documentos Tributarios Electrónicos</h3>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    N° Documento
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Código Generación
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sello Recepción
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dteDocuments.map((document) => {
                  const config = statusConfig[document.status]
                  const Icon = config.icon
                  const availableActions = getAvailableActions(document)

                  return (
                    <tr key={document.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {document.documentNumber}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.type === "factura"
                          ? "Factura"
                          : document.type === "credito_fiscal"
                            ? "Comprobante de Crédito Fiscal"
                            : "Nota de Remisión"}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{document.clientName}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {document.date.toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${document.total.toFixed(2)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Icon className={`w-4 h-4 ${config.color}`} />
                          <span className="text-sm font-medium text-gray-900">{config.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900 max-w-xs truncate">{document.generationCode}</td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{document.receptionSeal}</td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          {availableActions.map((action) => (
                            <div key={action}>{renderActionButton(document, action)}</div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Event Modal */}
      <DTEEventModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        document={selectedDocument}
        eventType={eventType}
        onConfirm={handleEventConfirm}
      />
    </div>
  )
}

export default DTEModule
