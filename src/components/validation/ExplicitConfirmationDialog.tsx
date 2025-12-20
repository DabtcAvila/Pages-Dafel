'use client';

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { 
  AlertTriangle, 
  Shield, 
  CheckCircle2, 
  XCircle, 
  Info,
  FileCheck,
  Scale,
  Clock
} from 'lucide-react';

interface ConfirmationAction {
  id: string;
  title: string;
  description: string;
  type: 'data_modification' | 'processing_decision' | 'regulatory_compliance' | 'final_approval';
  impact: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: {
    affectedFields?: string[];
    affectedRecords?: number;
    estimatedTime?: string;
    regulatoryImplications?: string[];
    businessConsequences?: string[];
    reversible?: boolean;
  };
}

interface ExplicitConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  action: ConfirmationAction;
  onConfirm: (confirmed: boolean, additionalNotes?: string) => void;
  isProcessing?: boolean;
}

export default function ExplicitConfirmationDialog({
  isOpen,
  onClose,
  action,
  onConfirm,
  isProcessing = false
}: ExplicitConfirmationDialogProps) {
  const [additionalNotes, setAdditionalNotes] = React.useState<string>('');
  const [hasReadAllDetails, setHasReadAllDetails] = React.useState<boolean>(false);
  const [confirmationChecks, setConfirmationChecks] = React.useState<{
    understandImpact: boolean;
    acceptResponsibility: boolean;
    reviewedDetails: boolean;
  }>({
    understandImpact: false,
    acceptResponsibility: false,
    reviewedDetails: false
  });

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'CRITICAL': return 'text-red-600 bg-red-50 border-red-200';
      case 'HIGH': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'MEDIUM': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'LOW': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'data_modification': return <FileCheck className="h-5 w-5" />;
      case 'processing_decision': return <CheckCircle2 className="h-5 w-5" />;
      case 'regulatory_compliance': return <Scale className="h-5 w-5" />;
      case 'final_approval': return <Shield className="h-5 w-5" />;
      default: return <Info className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'data_modification': return 'Modificación de Datos';
      case 'processing_decision': return 'Decisión de Procesamiento';
      case 'regulatory_compliance': return 'Cumplimiento Normativo';
      case 'final_approval': return 'Aprobación Final';
      default: return 'Confirmación Requerida';
    }
  };

  const allChecksCompleted = Object.values(confirmationChecks).every(check => check);
  const canConfirm = allChecksCompleted && hasReadAllDetails;

  const handleConfirm = () => {
    onConfirm(true, additionalNotes);
    resetDialog();
  };

  const handleCancel = () => {
    onConfirm(false);
    resetDialog();
  };

  const resetDialog = () => {
    setAdditionalNotes('');
    setHasReadAllDetails(false);
    setConfirmationChecks({
      understandImpact: false,
      acceptResponsibility: false,
      reviewedDetails: false
    });
    onClose();
  };

  const handleCheckboxChange = (checkType: keyof typeof confirmationChecks) => {
    setConfirmationChecks(prev => ({
      ...prev,
      [checkType]: !prev[checkType]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-600">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl">Confirmación Explícita Requerida</DialogTitle>
              <DialogDescription className="text-base">
                Esta acción requiere su confirmación explícita debido a su impacto potencial.
              </DialogDescription>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="flex items-center gap-1">
              {getTypeIcon(action.type)}
              {getTypeLabel(action.type)}
            </Badge>
            <Badge className={`${getImpactColor(action.impact)} border`}>
              Impacto: {action.impact}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Action Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{action.title}</h3>
            <p className="text-muted-foreground">{action.description}</p>
          </div>

          <Separator />

          {/* Impact Analysis */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              Análisis de Impacto
            </h4>
            
            <div className="grid grid-cols-2 gap-4">
              {action.details.affectedFields && action.details.affectedFields.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Campos Afectados:</p>
                  <div className="space-y-1">
                    {action.details.affectedFields.map((field, index) => (
                      <Badge key={index} variant="outline" className="mr-1 mb-1">
                        {field}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {action.details.affectedRecords && (
                <div>
                  <p className="text-sm font-medium mb-2">Registros Afectados:</p>
                  <p className="text-lg font-semibold text-blue-600">
                    {action.details.affectedRecords.toLocaleString()}
                  </p>
                </div>
              )}

              {action.details.estimatedTime && (
                <div>
                  <p className="text-sm font-medium mb-2 flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Tiempo Estimado:
                  </p>
                  <p className="text-sm">{action.details.estimatedTime}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Reversible:</p>
                <Badge variant={action.details.reversible ? 'default' : 'destructive'}>
                  {action.details.reversible ? 'Sí' : 'No'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Regulatory Implications */}
          {action.details.regulatoryImplications && action.details.regulatoryImplications.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2 text-blue-700">
                  <Scale className="h-4 w-4" />
                  Implicaciones Normativas
                </h4>
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {action.details.regulatoryImplications.map((implication, index) => (
                        <li key={index} className="text-sm">{implication}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </>
          )}

          {/* Business Consequences */}
          {action.details.businessConsequences && action.details.businessConsequences.length > 0 && (
            <>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="h-4 w-4" />
                  Consecuencias de Negocio
                </h4>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <ul className="list-disc list-inside space-y-1">
                      {action.details.businessConsequences.map((consequence, index) => (
                        <li key={index} className="text-sm">{consequence}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
            </>
          )}

          <Separator />

          {/* Explicit Confirmations */}
          <div className="space-y-4">
            <h4 className="font-medium">Confirmaciones Requeridas</h4>
            
            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={confirmationChecks.reviewedDetails}
                  onChange={() => handleCheckboxChange('reviewedDetails')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    He revisado todos los detalles y análisis de impacto
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Confirmo que he leído y entendido completamente la información presentada
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={confirmationChecks.understandImpact}
                  onChange={() => handleCheckboxChange('understandImpact')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    Entiendo el impacto y las consecuencias de esta acción
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Comprendo las implicaciones técnicas, normativas y de negocio
                  </p>
                </div>
              </label>

              <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={confirmationChecks.acceptResponsibility}
                  onChange={() => handleCheckboxChange('acceptResponsibility')}
                  className="mt-1"
                />
                <div className="flex-1">
                  <p className="font-medium text-sm">
                    Acepto la responsabilidad de esta decisión
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Confirmo que tengo autoridad para tomar esta decisión y acepto las consecuencias
                  </p>
                </div>
              </label>
            </div>

            <div
              className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              onClick={() => setHasReadAllDetails(true)}
            >
              <div className="flex items-center gap-2 mb-2">
                <input
                  type="checkbox"
                  checked={hasReadAllDetails}
                  readOnly
                  className="pointer-events-none"
                />
                <span className="font-medium text-sm">
                  He leído y entendido toda la información
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Haga clic aquí para confirmar que ha leído completamente toda la información presentada
              </p>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              Notas Adicionales (Opcional):
            </label>
            <textarea
              value={additionalNotes}
              onChange={(e) => setAdditionalNotes(e.target.value)}
              placeholder="Agregue cualquier comentario o justificación adicional para esta decisión..."
              className="w-full p-3 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
          </div>

          {/* Warning for High Impact Actions */}
          {(action.impact === 'HIGH' || action.impact === 'CRITICAL') && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Advertencia:</strong> Esta es una acción de alto impacto que puede tener consecuencias significativas. 
                Asegúrese de haber considerado todas las alternativas antes de proceder.
              </AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter className="flex-col space-y-2">
          {!canConfirm && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Complete todas las confirmaciones requeridas para proceder.
              </AlertDescription>
            </Alert>
          )}
          
          <div className="flex justify-end gap-2 w-full">
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={isProcessing}
              className="flex items-center gap-2"
            >
              <XCircle className="h-4 w-4" />
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!canConfirm || isProcessing}
              variant={action.impact === 'CRITICAL' ? 'destructive' : 'default'}
              className="flex items-center gap-2 min-w-32"
            >
              <CheckCircle2 className="h-4 w-4" />
              {isProcessing ? 'Procesando...' : 'Confirmar y Proceder'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}