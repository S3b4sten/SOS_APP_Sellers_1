
import React, { useState, useRef, useEffect } from 'react';
import { getAIListingHelp } from '../services/geminiService';
import { Product } from '../types';
import { formatCurrency } from '../utils';

interface SellFormProps {
  onClose: () => void;
  onAddProduct: (product: Product) => void;
}

const SellForm: React.FC<SellFormProps> = ({ onClose, onAddProduct }) => {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Capture, 2: AI, 3: Edit, 4: Final Confirm
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [details, setDetails] = useState({
    name: '',
    price: 0,
    description: '',
    category: '',
    seller: ''
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const startCamera = async () => {
    setCameraError(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      console.warn("Camera permission denied or unavailable:", err);
      setCameraError(true);
      setIsCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const data = canvasRef.current.toDataURL('image/jpeg');
        setImageBase64(data);
        stopCamera();
        handleAIAnalysis(data);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const data = reader.result as string;
        setImageBase64(data);
        handleAIAnalysis(data);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIAnalysis = async (imgData: string) => {
    setStep(2);
    setLoading(true);
    try {
      const suggestion = await getAIListingHelp(imgData);
      setDetails({
        name: suggestion.name,
        price: suggestion.suggestedPrice,
        description: suggestion.description,
        category: suggestion.category,
        seller: ''
      });
      setStep(3);
    } catch (error) {
      console.error(error);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const handleFinalSubmit = () => {
    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: details.name,
      imageUrl: imageBase64 || 'https://picsum.photos/400/400',
      originalPrice: details.price,
      description: details.description,
      category: details.category,
      createdAt: new Date().toISOString(),
      sellerName: details.seller || 'Bénévole',
      status: 'active'
    };
    onAddProduct(newProduct);
    onClose();
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  // Updated input class for better contrast and earthy feel
  const inputClass = "w-full px-6 py-4 rounded-2xl border-2 border-[#e7e5e4] bg-[#fafaf9] font-medium text-lg text-[#431407] outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-500 transition-all placeholder-[#a8a29e]";

  return (
    // GLASSMORPHISM BACKDROP: Blur fort + couleur terre semi-transparente
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-[#292524]/40">
      
      <div className="w-full h-full md:h-auto md:max-h-[90vh] md:max-w-2xl bg-white md:rounded-[32px] overflow-hidden flex flex-col shadow-2xl shadow-black/20 animate-in fade-in zoom-in-95 duration-500 border border-white/50">
        
        {/* Header Friendly */}
        <div className="p-6 border-b border-[#e7e5e4] flex justify-between items-center bg-white/80 backdrop-blur-md sticky top-0 z-10">
          <div>
            <h2 className="text-3xl font-serif font-black text-[#431407]">Ajouter un don</h2>
            <p className="text-xs text-[#ea580c] font-extrabold uppercase tracking-widest mt-1">
              {step === 1 && "Étape 1 : Photo de l'objet"}
              {step === 2 && "Analyse en cours..."}
              {step === 3 && "Étape 2 : Détails"}
              {step === 4 && "Étape 3 : Confirmation"}
            </p>
          </div>
          {step !== 2 && (
            <button onClick={onClose} className="p-2 bg-[#f5f5f4] text-[#78716c] rounded-full hover:bg-[#e7e5e4] hover:text-[#431407] transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="flex-grow overflow-y-auto no-scrollbar bg-[#ffffff]">
          {step === 1 && (
            <div className="flex flex-col h-full relative min-h-[450px]">
              <div className="relative flex-grow flex items-center justify-center bg-[#1c1917] overflow-hidden">
                <video 
                  ref={videoRef} 
                  autoPlay 
                  playsInline 
                  className={`w-full h-full object-cover transition-opacity duration-500 ${isCameraActive ? 'opacity-100' : 'opacity-0'}`}
                />
                {(!isCameraActive || cameraError) && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                    <div className="bg-white/10 p-5 rounded-full mb-6 backdrop-blur-md border border-white/20 shadow-xl">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-[#fdba74]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      </svg>
                    </div>
                    <p className="text-xl font-bold mb-2 tracking-tight">
                      {cameraError ? "Caméra inaccessible" : "Mode Photo"}
                    </p>
                    <p className="text-base text-stone-300 mb-8 max-w-xs font-medium">
                      {cameraError ? "Veuillez importer une photo depuis votre appareil." : "Autorisez la caméra ou choisissez un fichier."}
                    </p>
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-white text-[#c2410c] px-8 py-4 rounded-full font-bold text-base shadow-lg hover:bg-orange-50 transition-colors"
                    >
                      Choisir une photo
                    </button>
                  </div>
                )}
                
                {/* Cadre de visée doux */}
                {!cameraError && isCameraActive && (
                  <div className="absolute inset-10 border-2 border-white/40 rounded-[2.5rem] pointer-events-none">
                     <div className="absolute top-0 left-0 w-full h-full border-4 border-transparent rounded-[2.5rem]"></div>
                  </div>
                )}
              </div>

              <div className="p-8 bg-white flex items-center justify-around rounded-t-[40px] -mt-8 relative z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
                <button onClick={() => fileInputRef.current?.click()} className="p-5 bg-[#fff7ed] text-[#c2410c] rounded-2xl border border-orange-100 hover:bg-orange-100 transition-colors">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                  </svg>
                </button>
                {/* Bouton de capture activé seulement si caméra active */}
                <button 
                  onClick={capturePhoto} 
                  disabled={!isCameraActive}
                  className={`w-24 h-24 rounded-full flex items-center justify-center shadow-xl border-[6px] border-white ring-4 transition-all transform active:scale-95 ${
                    !isCameraActive 
                      ? 'bg-[#e7e5e4] ring-[#d6d3d1] cursor-not-allowed' 
                      : 'bg-[#ea580c] ring-orange-200 shadow-orange-300'
                  }`}
                >
                  <div className="w-10 h-10 bg-white rounded-full"></div>
                </button>
                <div className="w-14"></div> {/* Spacer for balance */}
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
              <canvas ref={canvasRef} className="hidden" />
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col items-center justify-center py-24 text-center px-10">
              <div className="relative w-24 h-24 mb-10">
                 <div className="absolute inset-0 border-[6px] border-orange-100 rounded-full"></div>
                 <div className="absolute inset-0 border-[6px] border-[#ea580c] rounded-full border-t-transparent animate-spin"></div>
              </div>
              <h3 className="text-3xl font-serif font-black text-[#431407] mb-3">Analyse de l'objet...</h3>
              <p className="text-[#78350f] font-medium text-base max-w-xs mx-auto">Notre petit assistant rédige une description pour vous faire gagner du temps.</p>
            </div>
          )}

          {step === 3 && (
            <div className="p-8 space-y-8 animate-in slide-in-from-right duration-300">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[#78350f] uppercase tracking-wider ml-2">Nom de l'objet</label>
                  <input 
                    type="text" 
                    value={details.name}
                    onChange={(e) => setDetails({...details, name: e.target.value})}
                    className={inputClass}
                  />
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-[#78350f] uppercase tracking-wider ml-2">Prix de base ($CA)</label>
                    <input 
                      type="number" 
                      value={details.price}
                      onChange={(e) => setDetails({...details, price: Number(e.target.value)})}
                      className={inputClass}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-extrabold text-[#78350f] uppercase tracking-wider ml-2">Catégorie</label>
                    <input 
                      type="text" 
                      value={details.category}
                      onChange={(e) => setDetails({...details, category: e.target.value})}
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[#78350f] uppercase tracking-wider ml-2">Description</label>
                  <textarea 
                    rows={4}
                    value={details.description}
                    onChange={(e) => setDetails({...details, description: e.target.value})}
                    className={`${inputClass} resize-none leading-relaxed`}
                  ></textarea>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-extrabold text-[#78350f] uppercase tracking-wider ml-2">Bénévole / Donateur</label>
                  <input 
                    type="text" 
                    value={details.seller}
                    placeholder="Votre prénom"
                    onChange={(e) => setDetails({...details, seller: e.target.value})}
                    className={inputClass}
                  />
                </div>
              </div>

              <button 
                onClick={() => setStep(4)}
                className="w-full py-5 bg-[#c2410c] text-white rounded-2xl font-bold text-xl shadow-lg shadow-orange-200 hover:bg-[#9a3412] hover:shadow-xl transition-all transform hover:-translate-y-0.5"
              >
                Vérifier la fiche
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="p-8 flex flex-col items-center animate-in zoom-in-95 duration-300">
               <div className="mb-8 text-center">
                  <span className="bg-[#dcfce7] text-[#15803d] px-5 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest border border-[#bbf7d0]">
                    Prêt à publier
                  </span>
                  <h3 className="text-3xl font-serif font-black text-[#431407] mt-6">Tout semble correct ?</h3>
               </div>

               <div className="w-full max-w-sm bg-white rounded-[24px] border-2 border-[#e7e5e4] overflow-hidden shadow-lg mb-10">
                  <div className="flex gap-5 p-5">
                    <div className="w-24 h-24 bg-[#f5f5f4] rounded-2xl overflow-hidden flex-shrink-0">
                       <img src={imageBase64 || ''} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col justify-center">
                       <h4 className="font-serif font-bold text-[#431407] text-xl line-clamp-1">{details.name}</h4>
                       <p className="text-[#78716c] text-sm line-clamp-2 mt-1.5 font-medium opacity-80">{details.description}</p>
                       <div className="mt-3 flex items-center gap-3">
                          <span className="text-[#c2410c] font-black text-lg">{formatCurrency(details.price)}</span>
                          <span className="text-[10px] bg-[#f5f5f4] text-[#57534e] px-2.5 py-1 rounded-lg uppercase font-bold border border-[#e7e5e4]">{details.category}</span>
                       </div>
                    </div>
                  </div>
               </div>

               <div className="w-full space-y-4">
                  <button 
                    onClick={handleFinalSubmit}
                    className="w-full py-5 bg-[#15803d] text-white rounded-2xl font-bold text-xl shadow-lg shadow-green-200 hover:bg-[#166534] hover:-translate-y-1 transition-all flex items-center justify-center gap-3"
                  >
                    <span>Oui, mettre en rayon</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button 
                    onClick={() => setStep(3)}
                    className="w-full py-4 bg-white text-[#78716c] rounded-2xl font-bold text-base border-2 border-[#e7e5e4] hover:bg-[#fafaf9] hover:text-[#292524] transition-all"
                  >
                    Modifier les informations
                  </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellForm;
