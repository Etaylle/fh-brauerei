import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Timer, Thermometer, ArrowUp, Star, Sun, Moon, Share2, Globe, QrCode, Calendar, ArrowLeft, ArrowRight, Droplets, Wheat, Award } from 'lucide-react';
import './BreweryApp.css';


// QR-Code Component
const QRCodeDisplay = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center backdrop-blur-sm bg-white/80 dark:bg-gray-800/80 border border-amber-100 dark:border-amber-900/30">
      <QrCode size={180} className="text-amber-900 mb-4" />
      <p className="text-center text-gray-700 dark:text-gray-300">Scannen Sie diesen QR-Code, um die Brauerei-App auf Ihrem Mobilgerät zu öffnen</p>
    </div>
  );
};

// Beer Glass Component
const BeerGlass = ({ className }) => {
  return (
    <div className={`beer-glass ${className}`}>
      <div className="beer-foam">
        <div className="beer-foam-bubble beer-foam-bubble-1"></div>
        <div className="beer-foam-bubble beer-foam-bubble-2"></div>
        <div className="beer-foam-bubble beer-foam-bubble-3"></div>
      </div>
      <div className="beer-liquid">
        <div className="beer-bubble beer-bubble-1"></div>
        <div className="beer-bubble beer-bubble-2"></div>
        <div className="beer-bubble beer-bubble-3"></div>
        <div className="beer-bubble beer-bubble-4"></div>
        <div className="beer-bubble beer-bubble-5"></div>
        <div className="beer-highlight"></div>
      </div>
    </div>
  );
};

// Main Component
export default function BreweryApp() {
  const [selectedProcess, setSelectedProcess] = useState('live');
  const [historicalData, setHistoricalData] = useState([]);
  const [userRating, setUserRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(127);
  const [averageRating, setAverageRating] = useState(4.2);
  const [language, setLanguage] = useState('de');
  const [darkMode, setDarkMode] = useState(true);
  const [showQRCode, setShowQRCode] = useState(false);
  const [historicalDay, setHistoricalDay] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [notification, setNotification] = useState(null);
  const [animateHero, setAnimateHero] = useState(false);
  const [currentData, setCurrentData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const chartRef = useRef(null);
  
  // Text Translations
  const translations = {
    de: {
      title: "FH Brauerei Wien",
      subtitle: "Live-Einblick in unseren Brauprozess",
      liveData: "Live Braudaten",
      lastUpdated: "Zuletzt aktualisiert",
      liveDataBtn: "Live Daten",
      hopfenkochenBtn: "Hopfenkochen",
      maischenBtn: "Maischen",
      gaerungBtn: "Gärung",
      temperature: "Temperatur",
      pressure: "Druck",
      currentBeer: "Aktuelles Bier",
      originalGravity: "Stammwürze",
      alcohol: "Alkohol",
      bitterness: "Bittere",
      recipe: "Rezept",
      malt: "Malz",
      hops: "Hopfen",
      yeast: "Hefe",
      rateBeer: "Bier bewerten",
      howTastes: "Wie schmeckt Ihnen unser",
      thankYou: "Vielen Dank für Ihre Bewertung!",
      overallRating: "Gesamtbewertung",
      ratings: "Bewertungen",
      footer: "Alle Daten werden alle 5 Minuten aktualisiert.",
      changeLang: "Switch to English",
      showQRCode: "QR-Code anzeigen",
      hideQRCode: "QR-Code ausblenden",
      share: "Teilen",
      darkMode: "Nachtmodus",
      lightMode: "Tagmodus",
      historicalData: "Historische Daten",
      previous: "Vorheriger Tag",
      next: "Nächster Tag",
      day: "Tag",
      copied: "Link in die Zwischenablage kopiert!",
      shareTitle: "Teilen über",
      slogan: "Tradition trifft Innovation",
      viewProcess: "Brauprozess einsehen",
      brewingSince: "Bierbraukunst seit 1785",
      qualityPromise: "Höchste Qualität garantiert",
      awardWinning: "Preisgekröntes Bier",
      ourTradition: "Unsere Tradition",
      visitUs: "Besuchen Sie uns",
      learnMore: "Mehr erfahren",
      subscribeNewsletter: "Newsletter abonnieren"
    },
    en: {
      title: "FH Brewery Vienna",
      subtitle: "Live insight into our brewing process",
      liveData: "Live Brewing Data",
      lastUpdated: "Last updated",
      liveDataBtn: "Live Data",
      hopfenkochenBtn: "Hop Boiling",
      maischenBtn: "Mashing",
      gaerungBtn: "Fermentation",
      temperature: "Temperature",
      pressure: "Pressure",
      currentBeer: "Current Beer",
      originalGravity: "Original Gravity",
      alcohol: "Alcohol",
      bitterness: "Bitterness",
      recipe: "Recipe",
      malt: "Malt",
      hops: "Hops",
      yeast: "Yeast",
      rateBeer: "Rate this Beer",
      howTastes: "How do you like our",
      thankYou: "Thank you for your rating!",
      overallRating: "Overall Rating",
      ratings: "ratings",
      footer: "All data is updated every 5 minutes.",
      changeLang: "Zu Deutsch wechseln",
      showQRCode: "Show QR Code",
      hideQRCode: "Hide QR Code",
      share: "Share",
      darkMode: "Dark Mode",
      lightMode: "Light Mode",
      historicalData: "Historical Data",
      previous: "Previous Day",
      next: "Next Day",
      day: "Day",
      copied: "Link copied to clipboard!",
      shareTitle: "Share via",
      slogan: "Tradition meets Innovation",
      viewProcess: "View brewing process",
      brewingSince: "Brewing excellence since 1785",
      qualityPromise: "Highest quality guaranteed",
      awardWinning: "Award-winning beer",
      ourTradition: "Our Tradition",
      visitUs: "Visit Us",
      learnMore: "Learn More",
      subscribeNewsletter: "Subscribe to newsletter"
    }
  };
  
  const t = translations[language];
  
  // Current Beer
  const currentBeer = {
    name: "Wiener Lager",
    description: language === 'de' ? 
      "Ein goldenes Lager mit ausgewogener Malzsüße und sanfter Hopfenbittere. Charakteristisch ist die subtile Karamellnote und der saubere, erfrischende Abgang." : 
      "A golden lager with balanced malt sweetness and gentle hop bitterness. Characteristic is the subtle caramel note and the clean, refreshing finish.",
    originalGravity: "12.5° Plato",
    alcohol: "5.2% vol.",
    ibu: "25",
    recipe: {
      malts: language === 'de' ? "Wiener Malz, Pilsner Malz, Karamellmalz" : "Vienna Malt, Pilsner Malt, Caramel Malt",
      hops: language === 'de' ? "Hallertauer Mittelfrüh, Tettnanger" : "Hallertauer Mittelfrüh, Tettnanger",
      yeast: language === 'de' ? "Untergärige Lager-Hefe" : "Bottom-fermenting Lager Yeast"
    },
    awards: ["Vienna Beer Festival 2024", "European Beer Star 2023"]
  };

  const [liveData, setLiveData] = useState(null);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/live');
        const data = await response.json();
        setCurrentData(data);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Fehler beim Abrufen der Live-Daten:', error);
      }
    };

    // Initial laden + dann alle 5 Sekunden aktualisieren
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedProcess === 'live') return;

    const fetchHistoricData = async () => {
      try {
        const response = await fetch(`http://localhost:3001/api/historic/${selectedProcess}?day=${historicalDay}`);
        const data = await response.json();
        setHistoricalData(data);
      } catch (error) {
        console.error('Fehler beim Abrufen der historischen Daten:', error);
      }
    };

    fetchHistoricData();
  }, [selectedProcess, historicalDay]);

  // Hero Animation
  useEffect(() => {
    setAnimateHero(true);
  }, []);

  // Dark Mode Settings
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);
  
  // Scroll Animation for Sections
  useEffect(() => {
    const sections = document.querySelectorAll('.fade-in-section');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    sections.forEach(section => observer.observe(section));
    
    return () => sections.forEach(section => observer.unobserve(section));
  }, []);
  
  // Rating Handler
  const handleRating = (rating) => {
    setUserRating(rating);
    const newTotal = totalRatings + 1;
    const newAverage = ((averageRating * totalRatings) + rating) / newTotal;
    setTotalRatings(newTotal);
    setAverageRating(newAverage);
  };
  
  // Share Function
  const handleShare = (platform) => {
    const shareUrl = window.location.href;
    let shareLink = "";
    
    switch(platform) {
      case 'copy':
        navigator.clipboard.writeText(shareUrl).then(() => {
          showNotification(t.copied);
        });
        break;
      case 'twitter':
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`${currentBeer.name} - ${t.overallRating}: ${averageRating.toFixed(1)}/5 - ${shareUrl}`)}`;
        window.open(shareLink, '_blank');
        break;
      case 'facebook':
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(shareLink, '_blank');
        break;
      case 'whatsapp':
        shareLink = `https://wa.me/?text=${encodeURIComponent(`${currentBeer.name} - ${t.overallRating}: ${averageRating.toFixed(1)}/5 - ${shareUrl}`)}`;
        window.open(shareLink, '_blank');
        break;
    }
    
    setShowShareOptions(false);
  };
  
  // Show Notification
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };
  
  // Change Day for Historical Data
  const changeHistoricalDay = (delta) => {
    setHistoricalDay(prev => {
      const newDay = prev + delta;
      return newDay >= 0 && newDay <= 6 ? newDay : prev;
    });
  };
  
  // CSS Classes for Dark/Light Mode
  const getThemeClasses = () => {
    return {
      bgMain: darkMode ? 'bg-gradient-to-b from-gray-900 to-amber-950' : 'bg-gradient-to-b from-amber-50 to-amber-100',
      bgHeader: darkMode ? 'bg-amber-900/70' : 'bg-amber-800/80',
      bgCard: darkMode ? 'bg-gray-800/90' : 'bg-white/95',
      textPrimary: darkMode ? 'text-white' : 'text-amber-900',
      textSecondary: darkMode ? 'text-gray-300' : 'text-amber-800',
      textMuted: darkMode ? 'text-gray-400' : 'text-amber-700/80',
      bgHighlight: darkMode ? 'bg-amber-900/30' : 'bg-amber-100/70',
      bgStatsCard: darkMode ? 'bg-gray-700' : 'bg-amber-50',
      bgFooter: darkMode ? 'bg-gray-800/90' : 'bg-amber-800/90',
      textFooter: darkMode ? 'text-gray-300' : 'text-amber-50',
      buttonPrimary: darkMode ? 'bg-amber-700 text-white hover:bg-amber-600' : 'bg-amber-700 text-white hover:bg-amber-600',
      buttonSecondary: darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-amber-200 text-amber-900 hover:bg-amber-300',
      borderColor: darkMode ? 'border-gray-700' : 'border-amber-200',
      gradientText: darkMode ? 'text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-yellow-500' : 'text-transparent bg-clip-text bg-gradient-to-r from-amber-900 to-amber-700'
    };
  };
  
  const theme = getThemeClasses();
  
  // Animation for Data Update
  const animateChart = () => {
    if (chartRef.current) {
      chartRef.current.classList.add('pulse-animation');
      setTimeout(() => {
        if (chartRef.current) {
          chartRef.current.classList.remove('pulse-animation');
        }
      }, 1000);
    }
  };
  
  useEffect(() => {
    animateChart();
  }, [currentData, historicalData]);

  return (
    <div className={`flex flex-col min-h-screen ${theme.bgMain} transition-colors duration-500 overflow-hidden relative`}>
      {/* Decorative Background Elements */}
      <div className="grain-pattern dark:opacity-20"></div>
      
{/* Hero Section with Brewery Panorama */}
<div className="relative w-full h-[70vh] overflow-hidden">
  {/* Background Image */}
  <div 
    className="absolute inset-0"
    style={{
      backgroundImage: 'url("/panorama.jpeg")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      filter: 'brightness(0.7)',
      transform: 'scale(1.05)',
      transition: 'transform 10s ease-in-out',
      zIndex: 0
    }}
  />

  {/* Optional Overlay (if needed) */}
  <div className="absolute inset-0 bg-black bg-opacity-30 z-10"></div>

  {/* Hero Content */}
  <div className={`relative z-20 flex flex-col items-center justify-center h-full text-center px-4 ${animateHero ? 'animate' : ''}`}>
    <h1 className={`text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight ${theme.gradientText} font-['Playfair_Display']`}>
      {t.title}
    </h1>
    <p className="text-2xl text-amber-100 mb-8 italic font-['Inter']">{t.slogan}</p>
    
    <div className="flex flex-wrap justify-center gap-4 mb-8">
      <div className="badge">
        <Droplets size={20} />
        {t.brewingSince}
      </div>
      <div className="badge">
        <Wheat size={20} />
        {t.qualityPromise}
      </div>
      <div className="badge">
        <Award size={20} />
        {t.awardWinning}
      </div>
    </div>

    <button 
      className="cta-button" 
      onClick={() => document.getElementById('brewData').scrollIntoView({ behavior: 'smooth' })}
    >
      {t.viewProcess}
    </button>
  </div>
</div>

      
      {/* Sticky Header with Background Image */}
      <header className={`sticky top-0 z-50 ${theme.bgHeader} text-white shadow-lg transition-all duration-300 glass-effect header-container`}>
        <div className="header-content container mx-auto">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-bold font-['Playfair_Display'] text-shadow">{t.title}</h2>
          </div>
          <div className="flex space-x-4">
            <button 
              onClick={() => setDarkMode(!darkMode)} 
              className="p-2 rounded-full bg-amber-600/30 hover:bg-amber-600/50 transition-all"
              aria-label={darkMode ? t.lightMode : t.darkMode}
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setLanguage(language === 'de' ? 'en' : 'de')} 
              className="p-2 rounded-full bg-amber-600/30 hover:bg-amber-600/50 transition-all"
              aria-label={t.changeLang}
            >
              <Globe size={20} />
            </button>
            <button 
              onClick={() => setShowQRCode(!showQRCode)} 
              className="p-2 rounded-full bg-amber-600/30 hover:bg-amber-600/50 transition-all"
              aria-label={showQRCode ? t.hideQRCode : t.showQRCode}
            >
              <QrCode size={20} />
            </button>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 flex-grow relative">
        {/* QR Code Modal */}
        {showQRCode && (
          <div className="mb-8 fade-in-section visible">
            <QRCodeDisplay />
          </div>
        )}
        
        <div id="brewData" className="mb-8 fade-in-section card-3d-effect glass-effect">
          <div className="p-6 rounded-2xl">
            <h2 className={`section-title text-3xl font-bold ${theme.textPrimary} font-['Playfair_Display']`}>{t.liveData}</h2>
            <div className={`flex items-center text-sm ${theme.textMuted} mb-6`}>
              <Timer size={18} className="mr-2" />
              <span>{t.lastUpdated}: {lastUpdated.toLocaleTimeString()}</span>
            </div>
            
            {/* Process Selector */}
            <div className="flex flex-wrap gap-3 mb-6">
              {['live', 'hopfenkochen', 'maischen', 'gaerung'].map(process => (
                <button 
                  key={process}
                  onClick={() => setSelectedProcess(process)}
                  className={`px-4 py-2 rounded-full font-medium transition-all transform hover:scale-105 ${selectedProcess === process ? theme.buttonPrimary : theme.buttonSecondary} font-['Inter']`}
                >
                  {t[`${process}Btn`]}
                </button>
              ))}
            </div>
            
            {/* Historical Data Controls */}
            {selectedProcess !== 'live' && (
              <div className="flex items-center justify-between mb-6 p-3 rounded-xl bg-amber-100/50 dark:bg-amber-900/20 border ${theme.borderColor} transition-all">
                <button 
                  onClick={() => changeHistoricalDay(-1)}
                  disabled={historicalDay === 0}
                  className={`p-2 rounded-full ${historicalDay === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-200/50 dark:hover:bg-amber-800/50'} transition-all`}
                >
                  <ArrowLeft size={22} className={theme.textPrimary} />
                </button>
                <div className="flex items-center">
                  <Calendar size={18} className="mr-2" />
                  <span className={`font-medium ${theme.textPrimary} font-['Inter']`}>
                    {t.historicalData}: {t.day} {historicalDay + 1}
                  </span>
                </div>
                <button 
                  onClick={() => changeHistoricalDay(1)}
                  disabled={historicalDay === 6}
                  className={`p-2 rounded-full ${historicalDay === 6 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-amber-200/50 dark:hover:bg-amber-800/50'} transition-all`}
                >
                  <ArrowRight size={22} className={theme.textPrimary} />
                </button>
              </div>
            )}
            
            {/* Brew Data Visualization */}
            <div className={`${theme.bgCard} p-6 rounded-2xl transition-all chart-container`} ref={chartRef}>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={selectedProcess === 'live' ? currentData : historicalData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#444' : '#ddd'} />
                    <XAxis 
                      dataKey="time" 
                      stroke={darkMode ? '#aaa' : '#666'} 
                      fontFamily="'Inter', sans-serif"
                    />
                    <YAxis 
                      yAxisId="left" 
                      orientation="left" 
                      stroke="#d97706" 
                      fontFamily="'Inter', sans-serif"
                    />
                    <YAxis 
                      yAxisId="right" 
                      orientation="right" 
                      domain={[0, 4]} 
                      stroke="#0284c7" 
                      fontFamily="'Inter', sans-serif"
                    />
                    <Tooltip 
                      contentStyle={{ 
                        background: darkMode ? 'rgba(51, 51, 51, 0.9)' : 'rgba(255, 255, 255, 0.9)', 
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                        fontFamily: "'Inter', sans-serif",
                        color: darkMode ? '#eee' : '#333'
                      }} 
                    />
                    <Legend wrapperStyle={{ fontFamily: "'Inter', sans-serif" }} />
                    <Line 
                      yAxisId="left"
                      type="monotone" 
                      dataKey="temperature" 
                      name={`${t.temperature} (°C)`} 
                      stroke="#d97706" 
                      activeDot={{ r: 10, fill: '#d97706', stroke: '#fff' }} 
                      strokeWidth={3}
                      dot={{ stroke: '#d97706', strokeWidth: 2, r: 4, fill: darkMode ? '#333' : '#fff' }}
                    />
                    <Line 
                      yAxisId="right"
                      type="monotone" 
                      dataKey="pressure" 
                      name={`${t.pressure} (bar)`}
                      stroke="#0284c7" 
                      strokeWidth={3}
                      dot={{ stroke: '#0284c7', strokeWidth: 2, r: 4, fill: darkMode ? '#333' : '#fff' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              
              {/* Current Values */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
                <div className={`${theme.bgHighlight} p-4 rounded-xl flex items-center transition-all glass-effect`}>
                  <Thermometer size={28} className="text-amber-600 mr-3" />
                  <div>
                    <p className={`text-sm ${theme.textSecondary} font-['Inter']`}>{t.temperature}</p>
                    <p className={`text-2xl font-bold ${theme.textPrimary} font-['Inter']`}>
                      {(selectedProcess === 'live' ? 
                        currentData[currentData.length - 1]?.temperature : 
                        historicalData[historicalData.length - 1]?.temperature) || '--'}°C
                    </p>
                  </div>
                </div>
                <div className={`${theme.bgHighlight} p-4 rounded-xl flex items-center transition-all glass-effect`}>
                  <ArrowUp size={28} className="text-blue-600 mr-3" />
                  <div>
                    <p className={`text-sm ${theme.textSecondary} font-['Inter']`}>{t.pressure}</p>
                    <p className={`text-2xl font-bold ${theme.textPrimary} font-['Inter']`}>
                      {(selectedProcess === 'live' ? 
                        currentData[currentData.length - 1]?.pressure : 
                        historicalData[historicalData.length - 1]?.pressure) || '--'} bar
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Current Beer Info and Rating */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Current Beer */}
          <div className="fade-in-section card-3d-effect glass-effect">
            <div className="p-6 rounded-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className={`section-title text-3xl font-bold ${theme.textPrimary} font-['Playfair_Display']`}>{t.currentBeer}</h2>
                <div className="relative">
                  <button 
                    onClick={() => setShowShareOptions(!showShareOptions)}
                    className={`p-2 rounded-full ${theme.bgHighlight} hover:bg-amber-600/50 transition-all transform hover:scale-110`}
                    aria-label={t.share}
                  >
                    <Share2 size={22} className={theme.textPrimary} />
                  </button>
                  {showShareOptions && (
                    <div className={`absolute right-0 mt-2 w-56 rounded-xl shadow-2xl py-2 z-20 ${theme.bgCard} border ${theme.borderColor} glass-effect`}>
                      <div className={`px-4 py-2 border-b ${theme.borderColor}`}>
                        <p className={`text-sm font-medium ${theme.textPrimary} font-['Inter']`}>{t.shareTitle}</p>
                      </div>
                      {['copy', 'twitter', 'facebook', 'whatsapp'].map(platform => (
                        <button 
                          key={platform}
                          className={`block px-4 py-2 text-sm w-full text-left hover:bg-amber-500/10 ${theme.textSecondary} font-['Inter'] transition-all`}
                          onClick={() => handleShare(platform)}
                        >
                          {platform.charAt(0).toUpperCase() + platform.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/3 mb-6 md:mb-0 flex justify-center">
                  <BeerGlass className="w-36 h-72" />
                </div>
                <div className="w-full md:w-2/3 md:pl-6">
                  <h3 className={`text-2xl font-bold ${theme.gradientText} mb-2 font-['Playfair_Display']`}>{currentBeer.name}</h3>
                  <div className="flex flex-wrap mb-3">
                    {currentBeer.awards.map(award => (
                      <span key={award} className="award-badge">
                        <Award size={14} />
                        {award}
                      </span>
                    ))}
                  </div>
                  <p className={`${theme.textSecondary} mb-6 font-['Inter'] leading-relaxed`}>{currentBeer.description}</p>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className={`${theme.bgHighlight} p-3 rounded-xl text-center glass-effect`}>
                      <p className={`text-xs ${theme.textSecondary} font-['Inter']`}>{t.originalGravity}</p>
                      <p className={`font-bold ${theme.textPrimary} font-['Inter']`}>{currentBeer.originalGravity}</p>
                    </div>
                    <div className={`${theme.bgHighlight} p-3 rounded-xl text-center glass-effect`}>
                      <p className={`text-xs ${theme.textSecondary} font-['Inter']`}>{t.alcohol}</p>
                      <p className={`font-bold ${theme.textPrimary} font-['Inter']`}>{currentBeer.alcohol}</p>
                    </div>
                    <div className={`${theme.bgHighlight} p-3 rounded-xl text-center glass-effect`}>
                      <p className={`text-xs ${theme.textSecondary} font-['Inter']`}>{t.bitterness}</p>
                      <p className={`font-bold ${theme.textPrimary} font-['Inter']`}>{currentBeer.ibu} IBU</p>
                    </div>
                  </div>
                  <h4 className={`font-bold ${theme.textPrimary} mb-2 font-['Inter']`}>{t.recipe}:</h4>
                  <ul className={`text-sm ${theme.textSecondary} font-['Inter']`}>
                    <li className="mb-1"><span className="font-medium">{t.malt}:</span> {currentBeer.recipe.malts}</li>
                    <li className="mb-1"><span className="font-medium">{t.hops}:</span> {currentBeer.recipe.hops}</li>
                    <li><span className="font-medium">{t.yeast}:</span> {currentBeer.recipe.yeast}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          {/* Voting System */}
          <div className="fade-in-section card-3d-effect glass-effect">
            <div className="p-6 rounded-2xl">
              <h2 className={`section-title text-3xl font-bold ${theme.textPrimary} mb-6 font-['Playfair_Display']`}>{t.rateBeer}</h2>
              <div className="flex flex-col items-center">
                <p className={`${theme.textSecondary} mb-6 font-['Inter']`}>{t.howTastes} {currentBeer.name}?</p>
                <div className="flex mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      onClick={() => handleRating(star)}
                      className="text-4xl mx-2 focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star 
                        size={40} 
                        fill={star <= userRating ? "#f59e0b" : "none"} 
                        stroke={star <= userRating ? "#f59e0b" : darkMode ? "#6b7280" : "#d1d5db"} 
                      />
                    </button>
                  ))}
                </div>
                {userRating > 0 && (
                  <div className="bg-green-100/80 dark:bg-green-900/50 text-green-800 dark:text-green-200 p-4 rounded-xl mb-6 text-center font-['Inter'] glass-effect">
                    {t.thankYou}
                  </div>
                )}
                <div className={`${theme.bgHighlight} p-6 rounded-xl w-full text-center glass-effect`}>
                  <h3 className={`text-xl font-bold ${theme.textPrimary} mb-3 font-['Inter']`}>{t.overallRating}</h3>
                  <div className="flex justify-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        size={28} 
                        fill={star <= Math.round(averageRating) ? "#f59e0b" : "none"} 
                        stroke={star <= Math.round(averageRating) ? "#f59e0b" : darkMode ? "#6b7280" : "#d1d5db"} 
                        className="mx-1" 
                      />
                    ))}
                  </div>
                  <p className={`text-amber-500 font-bold text-2xl font-['Inter']`}>{averageRating.toFixed(1)} / 5</p>
                  <p className={`text-sm ${theme.textMuted} font-['Inter']`}>({totalRatings} {t.ratings})</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`${theme.bgFooter} ${theme.textFooter} py-8 px-6 mt-12 transition-all duration-300 glass-effect`}>
        <div className="container mx-auto text-center">
          <h3 className={`text-2xl font-bold ${theme.textPrimary} mb-4 font-['Playfair_Display']`}>© {new Date().getFullYear()} {t.title}</h3>
          <p className="text-sm opacity-80 mb-4 font-['Inter']">{t.footer}</p>
          <div className="flex justify-center gap-4">
            <a href="#" className={`text-sm ${theme.textFooter} hover:text-amber-300 transition-all font-['Inter']`}>Impressum</a>
            <a href="#" className={`text-sm ${theme.textFooter} hover:text-amber-300 transition-all font-['Inter']`}>Datenschutz</a>
            <a href="#" className={`text-sm ${theme.textFooter} hover:text-amber-300 transition-all font-['Inter']`}>Kontakt</a>
          </div>
        </div>
      </footer>
      
      {/* Notification */}
      {notification && (
        <div className="notification font-['Inter']">
          {notification}
        </div>
      )}
    </div>
  );
  
}