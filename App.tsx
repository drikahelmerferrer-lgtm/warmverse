
import React, { useState, useEffect, useCallback } from 'react';
import { OrderStatus, SongOrder, User } from './types';

const PIX_CHAVE = "448.601.838-94";
const WHATSAPP_ADMIN = "5519978202025";

const DEFAULT_PRICES: Record<string, number> = {
  "Casamento": 200,
  "Chá de Bebê/Revelação": 150,
  "Aniversário Infantil": 130,
  "Aniversário Adulto": 145,
  "Corporativo/Eventos": 250,
  "Datas Especiais": 175,
  "Presente Pessoal": 110,
  "Jingles Publicitários": 250,
  "Outro": 150
};

const App: React.FC = () => {
  const [view, setView] = useState<'login' | 'home' | 'form' | 'status' | 'chat' | 'admin'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<SongOrder[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>(DEFAULT_PRICES);
  const [currentStep, setCurrentStep] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedOrderForChat, setSelectedOrderForChat] = useState<SongOrder | null>(null);
  
  const [formData, setFormData] = useState({
    theme: '',
    occasion: '',
    style: '',
    names: '',
    feelings: ''
  });

  useEffect(() => {
    const savedUser = localStorage.getItem('warmverse_user');
    const savedIsAdmin = localStorage.getItem('warmverse_isAdmin') === 'true';
    const savedPrices = localStorage.getItem('warmverse_prices');
    const savedOrders = localStorage.getItem('warmverse_orders');
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAdmin(savedIsAdmin);
      setView(savedIsAdmin ? 'admin' : 'home');
    }
    if (savedPrices) setPrices(JSON.parse(savedPrices));
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  useEffect(() => {
    if (orders.length > 0) {
      localStorage.setItem('warmverse_orders', JSON.stringify(orders));
    }
  }, [orders]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as any;
    const name = target.name.value;
    const whatsapp = target.whatsapp.value;
    
    const ADMIN_SECRET_CODE = 'Marcelaversewarm';
    const isLoggingAsAdmin = name === ADMIN_SECRET_CODE;
    
    const userData = { 
      name: isLoggingAsAdmin ? 'Marcela (Administradora)' : name, 
      whatsapp 
    };

    setUser(userData);
    setIsAdmin(isLoggingAsAdmin);
    localStorage.setItem('warmverse_user', JSON.stringify(userData));
    localStorage.setItem('warmverse_isAdmin', String(isLoggingAsAdmin));
    
    setView(isLoggingAsAdmin ? 'admin' : 'home');
  };

  const handleLogout = () => {
    localStorage.removeItem('warmverse_user');
    localStorage.removeItem('warmverse_isAdmin');
    setUser(null);
    setIsAdmin(false);
    setView('login');
  };

  const sendFullBriefingToWhatsapp = (order: SongOrder) => {
    const valor = prices[order.occasion] || 0;
    const mensagem = `*FINALIZAR PEDIDO - WARMVERSE*%0A%0A` +
      `*CLIENTE:* ${user?.name}%0A` +
      `*WHATSAPP:* ${user?.whatsapp}%0A%0A` +
      `*--- DETALHES DO BRIEFING ---*%0A` +
      `*TEMA:* ${order.theme}%0A` +
      `*OCASIÃO:* ${order.occasion}%0A` +
      `*ESTILO:* ${order.style}%0A` +
      `*NOMES:* ${order.names || 'Não informados'}%0A` +
      `*HISTÓRIA:* ${order.feelings}%0A%0A` +
      `*VALOR:* R$ ${valor.toFixed(2)}`;

    window.open(`https://wa.me/${WHATSAPP_ADMIN}?text=${mensagem}`, '_blank');
  };

  const submitOrder = useCallback((finalData: typeof formData) => {
    const newOrder: SongOrder = {
      id: Math.random().toString(36).substr(2, 9),
      ...finalData,
      status: OrderStatus.PENDING,
      createdAt: new Date().toLocaleDateString('pt-BR'),
    };
    
    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem('warmverse_orders', JSON.stringify(updatedOrders));
    setView('status');
  }, [orders, user, prices]);

  const updatePrice = (occasion: string, newPrice: number) => {
    const updated = { ...prices, [occasion]: newPrice };
    setPrices(updated);
    localStorage.setItem('warmverse_prices', JSON.stringify(updated));
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    setOrders(updated);
  };

  const openCustomerWhatsApp = (customerWhatsapp: string, theme: string) => {
    const cleanNumber = customerWhatsapp.replace(/\D/g, '');
    const message = encodeURIComponent(`Olá! Recebi seu pedido de música sobre "${theme}" no Warmverse. Vamos conversar?`);
    window.open(`https://wa.me/55${cleanNumber}?text=${message}`, '_blank');
  };

  const RenderLogin = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-warmverse rounded-[2rem] mx-auto mb-6 flex items-center justify-center shadow-2xl">
           <i className="fas fa-music text-white text-4xl"></i>
        </div>
        <h1 className="text-4xl font-bold text-warmverse mb-1 tracking-tight">Warmverse</h1>
        <p className="text-gray-400 text-xs uppercase font-black tracking-widest">A Sua História em Música</p>
      </div>
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">Seu Nome</label>
          <input required name="name" type="text" placeholder="Como podemos te chamar?" className="w-full p-5 rounded-2xl border-none shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
        </div>
        <div className="space-y-1">
          <label className="text-[10px] font-black text-gray-400 uppercase ml-2 tracking-widest">WhatsApp</label>
          <input required name="whatsapp" type="tel" placeholder="(00) 00000-0000" className="w-full p-5 rounded-2xl border-none shadow-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
        </div>
        <button type="submit" className="w-full py-5 gradient-bg text-white rounded-2xl font-bold text-lg shadow-xl hover:opacity-90 active:scale-95 transition-all mt-4">
          Acessar Agora
        </button>
      </form>
    </div>
  );

  const RenderAdminDashboard = () => (
    <div className="min-h-screen bg-gray-50 pb-24">
      <header className="p-6 pt-12 bg-white shadow-sm flex justify-between items-center border-b border-gray-100">
