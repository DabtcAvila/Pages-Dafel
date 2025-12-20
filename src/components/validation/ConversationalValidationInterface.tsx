'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ConversationalQuestion, ValidationConversation } from '@/lib/validation/ingestion/ConversationalValidationEngine';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  MessageCircle, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  FileText,
  Brain,
  Shield,
  TrendingUp
} from 'lucide-react';

interface ConversationalValidationInterfaceProps {
  conversation: ValidationConversation;
  onAnswerQuestion: (questionId: string, answer: any) => Promise<void>;
  onComplete: (finalResult: any) => void;
  isProcessing: boolean;
}

interface ChatMessage {
  id: string;
  type: 'question' | 'answer' | 'system';
  content: string;
  timestamp: Date;
  question?: ConversationalQuestion;
  answer?: any;
}

export default function ConversationalValidationInterface({
  conversation,
  onAnswerQuestion,
  onComplete,
  isProcessing
}: ConversationalValidationInterfaceProps) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<ConversationalQuestion | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [customResponse, setCustomResponse] = useState<string>('');
  const [progress, setProgress] = useState<number>(0);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    initializeConversation();
  }, [conversation]);

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    updateProgress();
  }, [conversation, chatHistory]);

  const initializeConversation = () => {
    // Mensaje de bienvenida
    const welcomeMessage: ChatMessage = {
      id: `welcome_${Date.now()}`,
      type: 'system',
      content: `¡Hola! Soy su asistente inteligente de validación actuarial. He analizado "${conversation.fileName}" y tengo algunas preguntas para asegurar que los datos sean perfectos para sus cálculos.`,
      timestamp: new Date()
    };

    setChatHistory([welcomeMessage]);

    // Cargar primera pregunta
    if (conversation.pendingQuestions.length > 0) {
      setCurrentQuestion(conversation.pendingQuestions[0]);
      addQuestionToChat(conversation.pendingQuestions[0]);
    }
  };

  const addQuestionToChat = (question: ConversationalQuestion) => {
    const questionMessage: ChatMessage = {
      id: question.id,
      type: 'question',
      content: question.description,
      timestamp: new Date(),
      question
    };

    setChatHistory(prev => [...prev, questionMessage]);
  };

  const handleAnswerSubmit = async () => {
    if (!currentQuestion || !selectedOption) return;

    const selectedOptionObj = currentQuestion.options.find(opt => opt.id === selectedOption);
    if (!selectedOptionObj) return;

    // Agregar respuesta al chat
    const answerMessage: ChatMessage = {
      id: `answer_${currentQuestion.id}`,
      type: 'answer',
      content: `${selectedOptionObj.label}: ${selectedOptionObj.description}${customResponse ? `\n\nDetalles adicionales: ${customResponse}` : ''}`,
      timestamp: new Date(),
      answer: {
        questionId: currentQuestion.id,
        option_id: selectedOption,
        action: selectedOptionObj.action,
        customInput: customResponse
      }
    };

    setChatHistory(prev => [...prev, answerMessage]);

    // Enviar respuesta
    await onAnswerQuestion(currentQuestion.id, answerMessage.answer);

    // Limpiar selección
    setSelectedOption('');
    setCustomResponse('');
    setCurrentQuestion(null);

    // Cargar siguiente pregunta o completar
    setTimeout(() => {
      loadNextQuestion();
    }, 1000);
  };

  const loadNextQuestion = () => {
    const nextQuestion = conversation.pendingQuestions.find(q => 
      !chatHistory.some(msg => msg.question?.id === q.id)
    );

    if (nextQuestion) {
      setCurrentQuestion(nextQuestion);
      addQuestionToChat(nextQuestion);
    } else {
      // Conversación completada
      addSystemMessage('¡Excelente! Hemos completado la validación de sus datos. Todo está listo para el cálculo actuarial.');
      
      if (conversation.finalApproval) {
        onComplete(conversation);
      }
    }
  };

  const addSystemMessage = (content: string) => {
    const systemMessage: ChatMessage = {
      id: `system_${Date.now()}`,
      type: 'system',
      content,
      timestamp: new Date()
    };

    setChatHistory(prev => [...prev, systemMessage]);
  };

  const updateProgress = () => {
    const totalQuestions = Object.keys(conversation.resolvedQuestions).length + conversation.pendingQuestions.length;
    const answeredQuestions = Object.keys(conversation.resolvedQuestions).length;
    const progressPercent = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
    setProgress(progressPercent);
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'destructive';
      case 'RECOMMENDED': return 'default';
      case 'OPTIONAL': return 'secondary';
      default: return 'default';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return <AlertTriangle className="h-4 w-4" />;
      case 'RECOMMENDED': return <MessageCircle className="h-4 w-4" />;
      case 'OPTIONAL': return <Clock className="h-4 w-4" />;
      default: return <MessageCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      {/* Header con información de progreso */}
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Brain className="h-5 w-5 text-blue-600" />
              Validación Inteligente: {conversation.fileName}
            </CardTitle>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {conversation.currentStep.replace('_', ' ').toUpperCase()}
              </Badge>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {progress.toFixed(0)}% Completo
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={progress} className="w-full" />
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>{Object.keys(conversation.resolvedQuestions).length} preguntas respondidas</span>
            <span>{conversation.pendingQuestions.length} preguntas pendientes</span>
          </div>
        </CardContent>
      </Card>

      {/* Chat Interface */}
      <Card className="flex-1 flex flex-col">
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatHistory.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'answer' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'answer' ? 'bg-blue-100 dark:bg-blue-900' : 
                  message.type === 'system' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-white dark:bg-gray-950 border'
                } rounded-lg p-4`}>
                  
                  {/* Question */}
                  {message.type === 'question' && message.question && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={getSeverityColor(message.question.severity)}>
                          {getSeverityIcon(message.question.severity)}
                          {message.question.severity}
                        </Badge>
                        <span className="font-medium text-sm">{message.question.title}</span>
                      </div>
                      
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                        {message.content}
                      </p>

                      {message.question.context?.sampleData && message.question.context.sampleData.length > 0 && (
                        <Alert>
                          <AlertDescription>
                            <strong>Datos de muestra:</strong> {message.question.context.sampleData.join(', ')}
                          </AlertDescription>
                        </Alert>
                      )}

                      {message.question.businessImpact && (
                        <Alert>
                          <Shield className="h-4 w-4" />
                          <AlertDescription>
                            <strong>Impacto de Negocio:</strong> {message.question.businessImpact}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}

                  {/* Answer */}
                  {message.type === 'answer' && (
                    <div className="text-right">
                      <p className="whitespace-pre-line">{message.content}</p>
                      <span className="text-xs text-muted-foreground">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  )}

                  {/* System Message */}
                  {message.type === 'system' && (
                    <div className="flex items-center gap-2 text-center">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <p className="text-sm">{message.content}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Current Question Response Interface */}
          {currentQuestion && (
            <div className="border-t p-4 space-y-4">
              <div className="space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Seleccione su respuesta:
                </h4>
                
                <div className="space-y-2">
                  {currentQuestion.options.map((option) => (
                    <div key={option.id} className="space-y-2">
                      <label className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
                        <input
                          type="radio"
                          name="questionOption"
                          value={option.id}
                          checked={selectedOption === option.id}
                          onChange={(e) => setSelectedOption(e.target.value)}
                          className="mt-1"
                        />
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{option.label}</span>
                            {option.isRecommended && (
                              <Badge variant="secondary" className="text-xs">Recomendado</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                          {option.consequences && option.consequences.length > 0 && (
                            <div className="text-xs text-amber-600 dark:text-amber-400">
                              <strong>Consecuencias:</strong> {option.consequences.join(', ')}
                            </div>
                          )}
                        </div>
                      </label>
                    </div>
                  ))}
                </div>

                {/* Custom response for manual override */}
                {selectedOption && currentQuestion.options.find(opt => opt.id === selectedOption)?.action === 'manual_override' && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Detalles adicionales:</label>
                    <Textarea
                      value={customResponse}
                      onChange={(e) => setCustomResponse(e.target.value)}
                      placeholder="Proporcione los detalles específicos o el valor que debería aplicarse..."
                      className="resize-none"
                      rows={3}
                    />
                  </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end gap-2">
                  <Button
                    onClick={handleAnswerSubmit}
                    disabled={!selectedOption || isProcessing}
                    className="min-w-24"
                  >
                    {isProcessing ? 'Procesando...' : 'Enviar Respuesta'}
                  </Button>
                </div>

                {/* Explicit Confirmation Warning */}
                {currentQuestion.requiresExplicitConfirmation && (
                  <Alert>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Confirmación Requerida:</strong> Esta decisión requiere su confirmación explícita ya que puede tener impacto significativo en los resultados.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          )}

          {/* Conversation Complete */}
          {!currentQuestion && conversation.pendingQuestions.length === 0 && (
            <div className="border-t p-4 text-center space-y-4">
              <div className="flex items-center justify-center gap-2 text-green-600">
                <CheckCircle className="h-6 w-6" />
                <span className="font-medium text-lg">Validación Completada</span>
              </div>
              <p className="text-muted-foreground">
                Todos los datos han sido validados exitosamente. Los resultados están listos para procesamiento.
              </p>
              <Button onClick={() => onComplete(conversation)} className="w-full">
                Proceder con el Cálculo Actuarial
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}