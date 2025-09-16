import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, Package, Brain, BarChart3, ShoppingCart, Calendar, Target } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  price: number;
  category: string;
  salesHistory: SalesData[];
}

interface SalesData {
  date: string;
  quantity: number;
  revenue: number;
  season?: string;
  promotion?: boolean;
}

interface PredictionResult {
  productId: string;
  predictedDemand: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
  suggestedOrder: number;
  daysUntilStockout: number;
}

interface Alert {
  id: string;
  type: 'low_stock' | 'high_demand' | 'order_suggestion' | 'stockout_risk';
  productId: string;
  productName: string;
  message: string;
  severity: 'low' | 'medium' | 'high';
  created: Date;
}

const InventoryAI: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [predictions, setPredictions] = useState<PredictionResult[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Simulación de datos históricos de productos
  useEffect(() => {
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Laptop Dell XPS 13',
        currentStock: 25,
        minStock: 10,
        maxStock: 100,
        price: 1200,
        category: 'Electronics',
        salesHistory: generateSalesHistory('1', 90)
      },
      {
        id: '2',
        name: 'Mouse Inalámbrico',
        currentStock: 5,
        minStock: 15,
        maxStock: 200,
        price: 25,
        category: 'Accessories',
        salesHistory: generateSalesHistory('2', 90)
      },
      {
        id: '3',
        name: 'Monitor 27" 4K',
        currentStock: 15,
        minStock: 8,
        maxStock: 50,
        price: 350,
        category: 'Electronics',
        salesHistory: generateSalesHistory('3', 90)
      },
      {
        id: '4',
        name: 'Teclado Mecánico',
        currentStock: 30,
        minStock: 20,
        maxStock: 150,
        price: 80,
        category: 'Accessories',
        salesHistory: generateSalesHistory('4', 90)
      }
    ];

    setProducts(mockProducts);
    runPredictionAnalysis(mockProducts);
    generateAlerts(mockProducts);
  }, [selectedPeriod]);

  // Genera datos históricos de ventas simulados
  function generateSalesHistory(productId: string, days: number): SalesData[] {
    const history: SalesData[] = [];
    const today = new Date();
    
    for (let i = days; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Simula patrones de ventas más realistas
      const baseQuantity = Math.floor(Math.random() * 10) + 1;
      const seasonalMultiplier = getSeasonalMultiplier(date);
      const promotionBonus = Math.random() < 0.1 ? 2 : 1; // 10% de días con promoción
      
      const quantity = Math.floor(baseQuantity * seasonalMultiplier * promotionBonus);
      
      history.push({
        date: date.toISOString().split('T')[0],
        quantity,
        revenue: quantity * (productId === '1' ? 1200 : productId === '2' ? 25 : productId === '3' ? 350 : 80),
        season: getSeason(date),
        promotion: promotionBonus > 1
      });
    }
    
    return history;
  }

  function getSeasonalMultiplier(date: Date): number {
    const month = date.getMonth();
    // Simula estacionalidad: más ventas en noviembre-diciembre, menos en enero-febrero
    if (month >= 10) return 1.5; // Nov-Dec
    if (month <= 1) return 0.7;  // Jan-Feb
    return 1.0;
  }

  function getSeason(date: Date): string {
    const month = date.getMonth();
    if (month >= 2 && month <= 4) return 'spring';
    if (month >= 5 && month <= 7) return 'summer';
    if (month >= 8 && month <= 10) return 'autumn';
    return 'winter';
  }

  // Algoritmo de predicción de demanda (modelo simplificado)
  function runPredictionAnalysis(products: Product[]) {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const newPredictions: PredictionResult[] = products.map(product => {
        const salesData = product.salesHistory.slice(-30); // Últimos 30 días
        const totalSales = salesData.reduce((sum, sale) => sum + sale.quantity, 0);
        const avgDailySales = totalSales / salesData.length;
        
        // Análisis de tendencia
        const firstHalf = salesData.slice(0, 15).reduce((sum, sale) => sum + sale.quantity, 0) / 15;
        const secondHalf = salesData.slice(-15).reduce((sum, sale) => sum + sale.quantity, 0) / 15;
        
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (secondHalf > firstHalf * 1.1) trend = 'up';
        else if (secondHalf < firstHalf * 0.9) trend = 'down';
        
        // Predicción para el período seleccionado
        const periodMultiplier = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 90;
        let predictedDemand = avgDailySales * periodMultiplier;
        
        // Ajustar por tendencia
        if (trend === 'up') predictedDemand *= 1.2;
        else if (trend === 'down') predictedDemand *= 0.8;
        
        // Ajustar por estacionalidad
        const seasonalAdjustment = getSeasonalMultiplier(new Date());
        predictedDemand *= seasonalAdjustment;
        
        predictedDemand = Math.round(predictedDemand);
        
        // Calcular días hasta agotamiento
        const daysUntilStockout = avgDailySales > 0 ? Math.floor(product.currentStock / avgDailySales) : 999;
        
        // Sugerir orden de compra
        const suggestedOrder = Math.max(0, predictedDemand + product.minStock - product.currentStock);
        
        return {
          productId: product.id,
          predictedDemand,
          confidence: Math.min(95, Math.max(65, 100 - (Math.abs(firstHalf - secondHalf) / avgDailySales) * 10)),
          trend,
          suggestedOrder,
          daysUntilStockout
        };
      });
      
      setPredictions(newPredictions);
      setIsAnalyzing(false);
    }, 2000);
  }

  function generateAlerts(products: Product[]) {
    const newAlerts: Alert[] = [];
    
    products.forEach(product => {
      // Alerta de stock bajo
      if (product.currentStock <= product.minStock) {
        newAlerts.push({
          id: `low_stock_${product.id}`,
          type: 'low_stock',
          productId: product.id,
          productName: product.name,
          message: `Stock crítico: Solo quedan ${product.currentStock} unidades`,
          severity: product.currentStock < product.minStock * 0.5 ? 'high' : 'medium',
          created: new Date()
        });
      }
      
      // Alerta de alto riesgo de agotamiento
      const recentSales = product.salesHistory.slice(-7).reduce((sum, sale) => sum + sale.quantity, 0);
      if (recentSales > 0) {
        const avgDailySales = recentSales / 7;
        const daysLeft = product.currentStock / avgDailySales;
        
        if (daysLeft <= 5) {
          newAlerts.push({
            id: `stockout_risk_${product.id}`,
            type: 'stockout_risk',
            productId: product.id,
            productName: product.name,
            message: `Riesgo de agotamiento en ${Math.floor(daysLeft)} días`,
            severity: daysLeft <= 2 ? 'high' : 'medium',
            created: new Date()
          });
        }
      }
    });
    
    setAlerts(newAlerts);
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-500 text-red-700';
      case 'medium': return 'bg-yellow-100 border-yellow-500 text-yellow-700';
      default: return 'bg-blue-100 border-blue-500 text-blue-700';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
      default: return <BarChart3 className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Gestión Inteligente de Inventarios</h1>
            <p className="text-gray-600">Predicción de demanda y alertas automatizadas</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'quarter')}
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="week">Próxima Semana</option>
            <option value="month">Próximo Mes</option>
            <option value="quarter">Próximo Trimestre</option>
          </select>
          
          <button
            onClick={() => runPredictionAnalysis(products)}
            disabled={isAnalyzing}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center space-x-2"
          >
            <Brain className="w-4 h-4" />
            <span>{isAnalyzing ? 'Analizando...' : 'Ejecutar Análisis'}</span>
          </button>
        </div>
      </div>

      {/* Alertas */}
      {alerts.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-orange-500" />
            <h2 className="text-lg font-semibold text-gray-900">Alertas Inteligentes</h2>
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">{alerts.length}</span>
          </div>
          
          <div className="space-y-3">
            {alerts.map(alert => (
              <div key={alert.id} className={`border-l-4 p-4 rounded-lg ${getSeverityColor(alert.severity)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{alert.productName}</p>
                    <p className="text-sm mt-1">{alert.message}</p>
                  </div>
                  <span className="text-xs opacity-75">
                    {alert.created.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Predicciones de Demanda */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-2 mb-6">
          <Target className="w-5 h-5 text-blue-500" />
          <h2 className="text-lg font-semibold text-gray-900">Predicciones de Demanda</h2>
          {isAnalyzing && (
            <div className="flex items-center space-x-2 text-purple-600">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
              <span className="text-sm">Procesando con IA...</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {products.map(product => {
            const prediction = predictions.find(p => p.productId === product.id);
            
            return (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">{product.name}</h3>
                  {prediction && getTrendIcon(prediction.trend)}
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Stock Actual</p>
                    <p className={`font-semibold ${product.currentStock <= product.minStock ? 'text-red-600' : 'text-green-600'}`}>
                      {product.currentStock} unidades
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Demanda Predicha</p>
                    <p className="font-semibold text-blue-600">
                      {prediction ? `${prediction.predictedDemand} unidades` : 'Calculando...'}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Confianza del Modelo</p>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${prediction?.confidence || 0}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-medium">{prediction?.confidence || 0}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-gray-500">Orden Sugerida</p>
                    <p className="font-semibold text-purple-600">
                      {prediction ? `${prediction.suggestedOrder} unidades` : 'Calculando...'}
                    </p>
                  </div>
                </div>
                
                {prediction && prediction.daysUntilStockout < 10 && (
                  <div className="mt-3 p-2 bg-orange-50 border border-orange-200 rounded text-sm text-orange-700">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>Se agotará en aproximadamente {prediction.daysUntilStockout} días</span>
                    </div>
                  </div>
                )}
                
                {prediction && prediction.suggestedOrder > 0 && (
                  <button className="w-full mt-3 bg-blue-50 hover:bg-blue-100 text-blue-700 py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
                    <ShoppingCart className="w-4 h-4" />
                    <span>Generar Orden de Compra</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Métricas del Sistema */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Productos Monitoreados</p>
              <p className="text-2xl font-bold text-gray-900">{products.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Alertas Activas</p>
              <p className="text-2xl font-bold text-gray-900">{alerts.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Precisión Promedio</p>
              <p className="text-2xl font-bold text-gray-900">
                {predictions.length > 0 
                  ? Math.round(predictions.reduce((sum, p) => sum + p.confidence, 0) / predictions.length)
                  : 0}%
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <ShoppingCart className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-gray-500 text-sm">Órdenes Sugeridas</p>
              <p className="text-2xl font-bold text-gray-900">
                {predictions.filter(p => p.suggestedOrder > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryAI;