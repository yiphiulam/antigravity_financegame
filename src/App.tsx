import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  PiggyBank, Wallet, Landmark, ShieldCheck, 
  LineChart, Coins, Building2, Users, 
  Bitcoin, TrendingUp, Zap, FileQuestion,
  ArrowLeft, Play, RotateCcw, AlertTriangle,
  Download, CheckCircle2, XCircle, Volume2, VolumeX, History,
  Bluetooth
} from 'lucide-react';

type RiskLevel = 'low' | 'medium' | 'high';

interface FinancialItem {
  id: string;
  name: string;
  description: string;
  riskLevel: RiskLevel;
  icon: React.ElementType;
}

const riskMap: Record<RiskLevel, string> = {
  low: '低風險',
  medium: '中風險',
  high: '高風險'
};

const riskDescriptions: Record<RiskLevel, string> = {
  low: '低風險資產通常具備保本、固定收益的特性，價格波動極小。',
  medium: '中風險資產在風險與報酬間取得平衡，有一定波動但不會像高風險資產那樣劇烈。',
  high: '高風險資產價格波動劇烈，可能帶來高報酬，但也伴隨極大的本金損失風險。'
};

const items: FinancialItem[] = [
  // 低風險 (10題)
  { id: 'l1', name: '銀行定存', description: '資金鎖定一段時間，保本且有固定利息。', riskLevel: 'low', icon: PiggyBank },
  { id: 'l2', name: '活期儲蓄', description: '隨時可提領的日常存款，極度安全但利息微薄。', riskLevel: 'low', icon: Wallet },
  { id: 'l3', name: '政府公債', description: '國家發行的借據，除非國家破產否則違約機率極低。', riskLevel: 'low', icon: Landmark },
  { id: 'l4', name: '儲蓄險', description: '結合基礎壽險與強迫儲蓄功能，適合長期累積資金。', riskLevel: 'low', icon: ShieldCheck },
  { id: 'l5', name: '貨幣市場基金', description: '投資於高流動性、短期有價證券，風險極低。', riskLevel: 'low', icon: Landmark },
  { id: 'l6', name: '外幣定存', description: '將資金轉換為外幣並定存，需注意匯率風險，但本金相對安全。', riskLevel: 'low', icon: Coins },
  { id: 'l7', name: '國庫券', description: '政府發行的短期債務憑證，被視為無風險資產。', riskLevel: 'low', icon: Landmark },
  { id: 'l8', name: '郵政儲金', description: '存放於郵局的存款，受國家保障，風險極低。', riskLevel: 'low', icon: PiggyBank },
  { id: 'l9', name: '地方政府公債', description: '地方政府發行的債券，違約風險低。', riskLevel: 'low', icon: Building2 },
  { id: 'l10', name: '保本型結構商品', description: '保證到期時可拿回本金的投資商品（需持有至到期）。', riskLevel: 'low', icon: ShieldCheck },
  
  // 中風險 (10題)
  { id: 'm1', name: '大盤指數型 ETF', description: '一次買下市場前幾大公司，分散單一企業倒閉風險。', riskLevel: 'medium', icon: LineChart },
  { id: 'm2', name: '高股息 ETF', description: '挑選穩定配息的公司組合，適合追求現金流。', riskLevel: 'medium', icon: Coins },
  { id: 'm3', name: '藍籌股 / 績優股', description: '大型、體質良好且具備產業領導地位的知名企業股票。', riskLevel: 'medium', icon: Building2 },
  { id: 'm4', name: '共同基金', description: '將資金集結交由專業經理人代為操盤，需支付管理費。', riskLevel: 'medium', icon: Users },
  { id: 'm5', name: '投資等級公司債', description: '信用評等較高的公司發行的債券，風險與報酬介於公債與股票之間。', riskLevel: 'medium', icon: Building2 },
  { id: 'm6', name: '平衡型基金', description: '同時投資於股票與債券，以分散風險並追求穩健增長。', riskLevel: 'medium', icon: LineChart },
  { id: 'm7', name: '金融股', description: '銀行、保險等金融機構的股票，通常配息穩定。', riskLevel: 'medium', icon: Landmark },
  { id: 'm8', name: 'REITs (不動產信託)', description: '將不動產證券化，讓投資人能以小額參與房地產市場。', riskLevel: 'medium', icon: Building2 },
  { id: 'm9', name: '智能理財 (機器人)', description: '透過演算法自動配置資產組合，通常以 ETF 為主。', riskLevel: 'medium', icon: Zap },
  { id: 'm10', name: 'ESG 永續 ETF', description: '投資於符合環境、社會、公司治理標準的企業。', riskLevel: 'medium', icon: LineChart },

  // 高風險 (10題)
  { id: 'h1', name: '比特幣', description: '24 小時交易，無漲跌幅限制，價格波動劇烈。', riskLevel: 'high', icon: Bitcoin },
  { id: 'h2', name: '個股當沖', description: '同一個交易日內買賣同一檔股票賺取價差，方向看錯容易產生巨大虧損。', riskLevel: 'high', icon: TrendingUp },
  { id: 'h3', name: '選擇權 / 權證', description: '具備高槓桿特性的衍生性商品，到期時價值可能直接歸零。', riskLevel: 'high', icon: Zap },
  { id: 'h4', name: '未上市櫃股票', description: '流動性極差，且公司財務資訊較不透明，具備高度不確定性。', riskLevel: 'high', icon: FileQuestion },
  { id: 'h5', name: '期貨合約', description: '約定未來某個時間以特定價格買賣資產，具備高槓桿。', riskLevel: 'high', icon: TrendingUp },
  { id: 'h6', name: '高收益債 (垃圾債)', description: '信用評等較低的公司發行的債券，提供高利息但違約風險高。', riskLevel: 'high', icon: AlertTriangle },
  { id: 'h7', name: '融資融券 (信用交易)', description: '向券商借錢買股票或借股票來賣，槓桿操作會放大虧損。', riskLevel: 'high', icon: TrendingUp },
  { id: 'h8', name: '迷因股 (Meme Stocks)', description: '因網路論壇炒作而暴漲暴跌的股票，基本面往往無法支撐股價。', riskLevel: 'high', icon: Zap },
  { id: 'h9', name: '虛擬貨幣合約', description: '加密貨幣的衍生性商品，槓桿倍數極高，極易爆倉。', riskLevel: 'high', icon: Bitcoin },
  { id: 'h10', name: '選擇權賣方', description: '收取權利金但承擔無限風險的交易策略。', riskLevel: 'high', icon: AlertTriangle },
];

type GameState = 'start' | 'countdown' | 'playing' | 'gameover';

interface GameStats {
  totalAnswered: number;
  correct: number;
  totalResponseTime: number;
  incorrectItems: { item: FinancialItem; selectedRisk: RiskLevel | 'timeout' }[];
}

interface HistoryRecord extends GameStats {
  score: number;
  date: string;
}

// --- Audio System ---
let audioCtx: AudioContext | null = null;

const initAudio = () => {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

const playTone = (freq: number[], type: OscillatorType, duration: number, vol = 0.1) => {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq[0], audioCtx.currentTime);
    if (freq.length > 1) {
      osc.frequency.exponentialRampToValueAtTime(freq[1], audioCtx.currentTime + duration);
    }
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) {
    console.error("Audio play error", e);
  }
};

const playCorrect = () => playTone([600, 1200], 'sine', 0.15);
const playIncorrect = () => playTone([300, 150], 'sawtooth', 0.3);
const playCountdown = () => playTone([440], 'square', 0.1);
const playGo = () => playTone([880], 'square', 0.3);
const playGameOver = () => playTone([400, 100], 'sawtooth', 0.8);

export default function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [countdownValue, setCountdownValue] = useState<number | string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [currentItem, setCurrentItem] = useState<FinancialItem | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | 'timeout' | null>(null);
  const [lastSelectedRisk, setLastSelectedRisk] = useState<RiskLevel | 'timeout' | null>(null);
  
  const [stats, setStats] = useState<GameStats>({ totalAnswered: 0, correct: 0, totalResponseTime: 0, incorrectItems: [] });
  const [questionStartTime, setQuestionStartTime] = useState<number>(0);
  const [allHistory, setAllHistory] = useState<HistoryRecord[]>([]);
  
  const isProcessingRef = useRef(false);
  const statsRef = useRef(stats);
  const scoreRef = useRef(score);
  const bgmRef = useRef<HTMLAudioElement | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  
  const [btStatus, setBtStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [debugMat, setDebugMat] = useState<string>('');
  const handleSortRef = useRef<((risk: RiskLevel) => void) | null>(null);
  const deviceRef = useRef<any>(null);
  const ledCharRef = useRef<any>(null);
  const feedbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load history on mount
  useEffect(() => {
    const saved = localStorage.getItem('financeGameHistory');
    if (saved) {
      try {
        setAllHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse history", e);
      }
    }

    // Setup BGM
    bgmRef.current = new Audio('https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0a13f69d2.mp3?filename=casual-game-background-music-114421.mp3');
    bgmRef.current.loop = true;
    bgmRef.current.volume = 0.15;

    return () => {
      if (bgmRef.current) {
        bgmRef.current.pause();
        bgmRef.current = null;
      }
    };
  }, []);

  // Handle Mute
  useEffect(() => {
    if (bgmRef.current) {
      bgmRef.current.muted = isMuted;
    }
    if (isMuted) {
      audioCtx?.suspend();
    } else {
      audioCtx?.resume();
    }
  }, [isMuted]);

  // Handle BGM Play/Pause based on game state
  useEffect(() => {
    if (gameState === 'playing' || gameState === 'countdown') {
      bgmRef.current?.play().catch(e => console.log("BGM play prevented", e));
    } else {
      bgmRef.current?.pause();
      if (bgmRef.current) bgmRef.current.currentTime = 0;
    }
  }, [gameState]);

  // Keep refs updated for game over logic
  useEffect(() => {
    statsRef.current = stats;
    scoreRef.current = score;
  }, [stats, score]);

  // Keep handleSort ref updated for Bluetooth callbacks
  useEffect(() => {
    handleSortRef.current = handleSort;
  });

  const sendLedCommand = async (entries: {row: number, col: number, mode: number, color: number}[]) => {
    if (!ledCharRef.current) return;
    const dataLength = entries.length * 3;
    const buffer = new Uint8Array(1 + dataLength + 1);
    buffer[0] = dataLength;
    let offset = 1;
    for (const e of entries) {
      const loc = ((e.row & 0x0f) << 4) | (e.col & 0x0f);
      buffer[offset++] = loc;
      buffer[offset++] = e.mode & 0xff;
      buffer[offset++] = e.color & 0xff;
    }
    let xor = 0;
    for (let i = 0; i < buffer.length - 1; i++) {
      xor ^= buffer[i];
    }
    buffer[buffer.length - 1] = xor;

    try {
      if (typeof ledCharRef.current.writeValueWithoutResponse === 'function') {
        await ledCharRef.current.writeValueWithoutResponse(buffer);
      } else if (typeof ledCharRef.current.writeValue === 'function') {
        await ledCharRef.current.writeValue(buffer);
      } else if (typeof ledCharRef.current.writeValueWithResponse === 'function') {
        await ledCharRef.current.writeValueWithResponse(buffer);
      }
    } catch (err) {
      console.error('LED command failed:', err);
    }
  };

  const flashMat = async (isCorrect: boolean) => {
    if (!ledCharRef.current) return;
    const color = isCorrect ? 21 : 1; // 21: Green, 1: Red
    // Turn on all 3 columns
    const entriesOn = [0, 1, 2].map(col => ({ row: 0, col, mode: 0x00, color }));
    await sendLedCommand(entriesOn);
    
    // Turn off after 2000ms
    setTimeout(async () => {
      const entriesOff = [0, 1, 2].map(col => ({ row: 0, col, mode: 0x00, color: 0 }));
      await sendLedCommand(entriesOff);
    }, 2000);
  };

  const connectBluetooth = async () => {
    if (!navigator.bluetooth) {
      alert('您的瀏覽器不支援 Web Bluetooth API。請使用 Chrome 或 Edge 瀏覽器。\n\n若地墊是藍牙鍵盤模式，請直接在系統設定中配對即可。');
      return;
    }

    if (btStatus === 'connected' && deviceRef.current) {
      deviceRef.current.gatt?.disconnect();
      return;
    }

    try {
      setBtStatus('connecting');
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ name: 'WTS2' }],
        optionalServices: [
          '0000fee0-0000-1000-8000-00805f9b34fb',
          '00001800-0000-1000-8000-00805f9b34fb',
          '00001801-0000-1000-8000-00805f9b34fb'
        ]
      });
      
      deviceRef.current = device;

      const server = await device.gatt?.connect();
      if (!server) throw new Error('無法連接到藍牙設備');

      const service = await server.getPrimaryService('0000fee0-0000-1000-8000-00805f9b34fb');
      const sensorChar = await service.getCharacteristic('0000fee2-0000-1000-8000-00805f9b34fb');
      const ledChar = await service.getCharacteristic('0000fee3-0000-1000-8000-00805f9b34fb');
      ledCharRef.current = ledChar;

      await sensorChar.startNotifications();
      const activePresses = new Map<number, NodeJS.Timeout>();

      sensorChar.addEventListener('characteristicvaluechanged', (event: any) => {
        const value = event.target.value;
        const bytes = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);

        // 解析感測器資料
        for (let i = 0; i + 1 < bytes.length; i += 2) {
          const b0 = bytes[i];
          const b1 = bytes[i + 1];

          const rowIndex = b0 >> 4;
          const colIndex = b0 & 0x0f; // 取得行號 (0, 1, 2...)

          // 判斷是否有按壓 (四個感測器任一個大於 0)
          const s0 = b1 & 0b11;
          const s1 = (b1 >> 2) & 0b11;
          const s2 = (b1 >> 4) & 0b11;
          const s3 = (b1 >> 6) & 0b11;
          
          // 稍微提高觸發門檻，避免極輕微的誤觸 (總壓力量 >= 2)
          const pressureSum = s0 + s1 + s2 + s3;
          const isPressed = pressureSum >= 2;

          if (isPressed) {
            if (!activePresses.has(colIndex)) {
              setDebugMat(`Row: ${rowIndex}, Col: ${colIndex} (感測中...)`);
              // 必須持續踩踏 400 毫秒才算確認
              const timer = setTimeout(() => {
                setDebugMat(`Row: ${rowIndex}, Col: ${colIndex} (已確認)`);
                if (colIndex === 0) {
                  handleSortRef.current?.('low');
                } else if (colIndex === 1) {
                  handleSortRef.current?.('medium');
                } else if (colIndex === 2) {
                  handleSortRef.current?.('high');
                }
              }, 400);
              activePresses.set(colIndex, timer);
            }
          } else {
            // 腳離開地墊，取消計時
            if (activePresses.has(colIndex)) {
              clearTimeout(activePresses.get(colIndex));
              activePresses.delete(colIndex);
              setDebugMat(`Row: ${rowIndex}, Col: ${colIndex} (已離開)`);
            }
          }
        }
      });

      device.addEventListener('gattserverdisconnected', () => {
        setBtStatus('disconnected');
        deviceRef.current = null;
        ledCharRef.current = null;
        alert('藍牙地墊已斷線');
      });

      setBtStatus('connected');
    } catch (error) {
      console.error(error);
      setBtStatus('disconnected');
      deviceRef.current = null;
      ledCharRef.current = null;
      if ((error as Error).name !== 'NotFoundError') {
        alert('藍牙連接失敗：' + (error as Error).message);
      }
    }
  };

  const initGame = () => {
    initAudio();
    setScore(0);
    setTimeLeft(60);
    setStats({ totalAnswered: 0, correct: 0, totalResponseTime: 0, incorrectItems: [] });
    setGameState('countdown');
    setCountdownValue(3);
    if (!isMuted) playCountdown();
  };

  // Countdown Logic
  useEffect(() => {
    if (gameState === 'countdown') {
      if (typeof countdownValue === 'number' && countdownValue > 1) {
        const timer = setTimeout(() => {
          setCountdownValue(countdownValue - 1);
          if (!isMuted) playCountdown();
        }, 1000);
        return () => clearTimeout(timer);
      } else if (countdownValue === 1) {
        const timer = setTimeout(() => {
          setCountdownValue('GO!');
          if (!isMuted) playGo();
        }, 1000);
        return () => clearTimeout(timer);
      } else if (countdownValue === 'GO!') {
        const timer = setTimeout(() => {
          startGame();
        }, 800);
        return () => clearTimeout(timer);
      }
    }
  }, [gameState, countdownValue, isMuted]);

  const startGame = () => {
    setGameState('playing');
    isProcessingRef.current = false;
    pickRandomItem();
  };

  const pickRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * items.length);
    setCurrentItem(items[randomIndex]);
    setFeedback(null);
    setQuestionStartTime(Date.now());
  };

  const handleGameOver = () => {
    setGameState('gameover');
    if (!isMuted) playGameOver();
    
    setAllHistory(prev => {
      const newRecord = { ...statsRef.current, score: scoreRef.current, date: new Date().toISOString() };
      const newHistory = [...prev, newRecord];
      localStorage.setItem('financeGameHistory', JSON.stringify(newHistory));
      return newHistory;
    });
  };

  // Timer Logic
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleGameOver();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [gameState]);

  // Per-question 2-second timer
  useEffect(() => {
    if (gameState === 'playing' && currentItem && !feedback) {
      questionTimerRef.current = setTimeout(() => {
        handleTimeout();
      }, 2000);
    }
    return () => {
      if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
    };
  }, [currentItem, feedback, gameState]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== 'playing' || isProcessingRef.current || !currentItem) return;
      
      const key = e.key.toLowerCase();
      if (key === 'a') handleSort('low');
      else if (key === 's') handleSort('medium');
      else if (key === 'd') handleSort('high');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  const handleNextQuestion = () => {
    if (feedbackTimeoutRef.current) {
      clearTimeout(feedbackTimeoutRef.current);
      feedbackTimeoutRef.current = null;
    }
    if (questionTimerRef.current) {
      clearTimeout(questionTimerRef.current);
      questionTimerRef.current = null;
    }
    setFeedback(null);
    pickRandomItem();
    isProcessingRef.current = false;
  };

  const handleTimeout = () => {
    if (gameState !== 'playing' || !currentItem || isProcessingRef.current) return;
    isProcessingRef.current = true;
    
    if (!isMuted) playIncorrect();
    setFeedback('timeout');
    setLastSelectedRisk('timeout');
    flashMat(false);

    setStats(prev => ({
      ...prev,
      totalAnswered: prev.totalAnswered + 1,
      totalResponseTime: prev.totalResponseTime + 2000,
      incorrectItems: [...prev.incorrectItems, { item: currentItem, selectedRisk: 'timeout' }]
    }));

    feedbackTimeoutRef.current = setTimeout(() => {
      handleNextQuestion();
    }, 2000); // Show timeout for 2 seconds
  };

  const handleSort = (selectedRisk: RiskLevel) => {
    if (gameState !== 'playing' || !currentItem || isProcessingRef.current) return;
    isProcessingRef.current = true;
    if (questionTimerRef.current) clearTimeout(questionTimerRef.current);
    setLastSelectedRisk(selectedRisk);

    const responseTime = Date.now() - questionStartTime;
    const isCorrect = selectedRisk === currentItem.riskLevel;

    if (isCorrect) {
      if (!isMuted) playCorrect();
      setScore((prev) => prev + 1);
      setFeedback('correct');
      flashMat(true);
    } else {
      if (!isMuted) playIncorrect();
      setFeedback('incorrect');
      flashMat(false);
    }

    setStats(prev => ({
      ...prev,
      totalAnswered: prev.totalAnswered + 1,
      totalResponseTime: prev.totalResponseTime + responseTime,
      correct: prev.correct + (isCorrect ? 1 : 0),
      incorrectItems: isCorrect ? prev.incorrectItems : [...prev.incorrectItems, { item: currentItem, selectedRisk }]
    }));

    // Show popup for 2s then switch
    feedbackTimeoutRef.current = setTimeout(() => {
      handleNextQuestion();
    }, 2000);
  };

  const exportCSV = (data: GameStats & { score: number }, filename: string) => {
    const avgTime = data.totalAnswered > 0 ? (data.totalResponseTime / data.totalAnswered / 1000).toFixed(1) : '0';
    const accuracy = data.totalAnswered > 0 ? Math.round((data.correct / data.totalAnswered) * 100) : 0;

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    
    csvContent += "總答題數,正確數,錯誤數,正確率(%),平均答題時間(秒),總得分\n";
    csvContent += `${data.totalAnswered},${data.correct},${data.incorrectItems.length},${accuracy}%,${avgTime},${data.score}\n\n`;

    csvContent += "錯誤題目,描述,玩家選擇,正確分類\n";
    data.incorrectItems.forEach(({ item, selectedRisk }) => {
      const desc = `"${item.description.replace(/"/g, '""')}"`;
      const selectedStr = selectedRisk === 'timeout' ? '未作答(超時)' : riskMap[selectedRisk];
      csvContent += `${item.name},${desc},${selectedStr},${riskMap[item.riskLevel]}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportAllHistoryCSV = () => {
    if (allHistory.length === 0) {
      alert('尚無遊玩紀錄！');
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,\uFEFF";
    csvContent += "遊玩時間,總答題數,正確數,錯誤數,正確率(%),平均答題時間(秒),總得分\n";

    allHistory.forEach(record => {
      const date = new Date(record.date).toLocaleString();
      const accuracy = record.totalAnswered > 0 ? Math.round((record.correct / record.totalAnswered) * 100) : 0;
      const avgTime = record.totalAnswered > 0 ? (record.totalResponseTime / record.totalAnswered / 1000).toFixed(2) : '0';
      csvContent += `${date},${record.totalAnswered},${record.correct},${record.incorrectItems.length},${accuracy}%,${avgTime},${record.score}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "理財知識分類_所有遊玩紀錄.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-100 to-green-200 flex flex-col items-center justify-center overflow-hidden font-sans select-none relative">
      
      {/* Global Controls */}
      <div className="absolute top-6 right-6 flex flex-col items-end gap-3 z-50">
        <div className="flex gap-3">
          <button 
            onClick={connectBluetooth}
            className={`bg-white/80 p-3 rounded-full shadow-md hover:bg-white transition-colors flex items-center justify-center ${btStatus === 'connected' ? 'text-blue-600 ring-2 ring-blue-400' : btStatus === 'connecting' ? 'text-yellow-500 animate-pulse' : 'text-gray-600'}`}
            title={btStatus === 'connected' ? "斷開藍牙地墊" : "連接藍牙地墊"}
          >
            <Bluetooth className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="bg-white/80 p-3 rounded-full shadow-md hover:bg-white transition-colors"
            title={isMuted ? "取消靜音" : "靜音"}
          >
            {isMuted ? <VolumeX className="w-6 h-6 text-gray-600" /> : <Volume2 className="w-6 h-6 text-gray-600" />}
          </button>
        </div>
        {btStatus === 'connected' && debugMat && (
          <div className="bg-black/70 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg backdrop-blur-sm">
            最後踩踏: {debugMat}
          </div>
        )}
      </div>

      {gameState === 'start' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/90 backdrop-blur-sm p-10 rounded-[2rem] shadow-2xl text-center max-w-md w-full mx-4"
        >
          <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Landmark className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-800 mb-4 tracking-tight">理財知識分類</h1>
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            為大學生設計的理財遊戲！<br/>
            題庫共 30 題隨機出題，<br/>
            在 60 秒內將各種投資工具分類到正確的風險等級。
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={initGame}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl text-xl transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <Play className="w-6 h-6 fill-current" />
              開始挑戰
            </button>
            <button 
              onClick={exportAllHistoryCSV}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-8 rounded-2xl text-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <History className="w-5 h-5" />
              下載所有遊玩紀錄
            </button>
          </div>
        </motion.div>
      )}

      {gameState === 'countdown' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <AnimatePresence mode="wait">
            <motion.div
              key={countdownValue}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-9xl font-black text-white drop-shadow-[0_0_30px_rgba(255,255,255,0.8)]"
            >
              {countdownValue}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="w-full h-screen flex flex-col max-w-5xl mx-auto relative">
          
          {/* Popup Overlay for Feedback */}
          <AnimatePresence>
            {feedback && currentItem && (
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 cursor-pointer"
                onClick={handleNextQuestion}
              >
                <div 
                  className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl text-center flex flex-col items-center"
                  onClick={(e) => e.stopPropagation()}
                >
                  {feedback === 'timeout' ? (
                    <>
                      <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                        <AlertTriangle className="w-16 h-16 text-orange-500" />
                      </div>
                      <h2 className="text-3xl font-black text-orange-600 mb-2">時間到！</h2>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentItem.name}</h3>
                      
                      <div className="bg-green-50 border border-green-200 rounded-xl p-4 w-full mb-6 text-left">
                        <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
                          <CheckCircle2 className="w-5 h-5" />
                          正確分類：{riskMap[currentItem.riskLevel]}
                        </div>
                        <p className="text-sm text-gray-700 font-medium">
                          {currentItem.description}
                        </p>
                      </div>
                    </>
                  ) : feedback === 'correct' ? (
                    <>
                      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle2 className="w-16 h-16 text-green-500" />
                      </div>
                      <h2 className="text-3xl font-black text-green-600 mb-2">答對了！</h2>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentItem.name}</h3>
                      
                      <div className="bg-gray-50 rounded-xl p-4 w-full mb-6 border border-gray-100">
                        <p className="text-gray-600 text-lg font-medium leading-relaxed">
                          {currentItem.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-500 font-bold mb-6">
                        正確分類：<span className={`px-3 py-1 rounded-lg text-white ${
                          currentItem.riskLevel === 'low' ? 'bg-green-500' :
                          currentItem.riskLevel === 'medium' ? 'bg-yellow-500' : 'bg-red-500'
                        }`}>{riskMap[currentItem.riskLevel]}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                        <XCircle className="w-16 h-16 text-red-500" />
                      </div>
                      <h2 className="text-3xl font-black text-red-600 mb-2">答錯了！</h2>
                      <h3 className="text-2xl font-bold text-gray-800 mb-4">{currentItem.name}</h3>
                      
                      <div className="flex flex-col gap-3 w-full mb-6 text-left">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-red-700 font-bold mb-1">
                            <XCircle className="w-5 h-5" />
                            你的選擇：{lastSelectedRisk ? riskMap[lastSelectedRisk] : ''}
                          </div>
                          <p className="text-sm text-gray-700 font-medium">
                            {lastSelectedRisk ? riskDescriptions[lastSelectedRisk] : ''} <br/>
                            <span className="text-red-600 mt-1 inline-block">但「{currentItem.name}」的特性並不符合此風險等級。</span>
                          </p>
                        </div>
                        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                          <div className="flex items-center gap-2 text-green-700 font-bold mb-1">
                            <CheckCircle2 className="w-5 h-5" />
                            正確分類：{riskMap[currentItem.riskLevel]}
                          </div>
                          <p className="text-sm text-gray-700 font-medium">
                            {currentItem.description}
                          </p>
                        </div>
                      </div>
                    </>
                  )}

                  <button 
                    onClick={handleNextQuestion}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-xl text-lg transition-colors"
                  >
                    點擊畫面或按此繼續 (2秒後自動跳轉)
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Top Bar */}
          <div className="flex justify-between items-center p-6 w-full z-10">
            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm flex items-center gap-3">
              <span className="text-gray-600 font-bold text-xl">得分:</span>
              <span className="text-red-500 font-black text-2xl">{score}</span>
            </div>
            
            <h2 className="text-white font-black text-2xl tracking-widest drop-shadow-md hidden md:block">
              理財知識分類
            </h2>

            <div className="bg-white px-6 py-3 rounded-2xl shadow-sm flex items-center gap-3">
              <span className="text-gray-600 font-bold text-xl">時間:</span>
              <span className="text-blue-500 font-black text-2xl">{timeLeft}</span>
            </div>
          </div>

          {/* Back Button */}
          <button 
            onClick={() => setGameState('start')}
            className="absolute left-6 top-24 md:top-auto md:bottom-6 bg-white p-4 rounded-full shadow-lg hover:bg-gray-50 transition-colors z-20"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700" />
          </button>

          {/* Center Item Area */}
          <div className="flex-1 flex items-center justify-center p-4 z-10">
            <AnimatePresence mode="wait">
              {currentItem && !feedback && (
                <motion.div
                  key={currentItem.id}
                  initial={{ scale: 0.5, opacity: 0, y: -50 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0.8, opacity: 0, y: 50 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-72 h-72 md:w-80 md:h-80 flex flex-col items-center justify-center relative border-4 border-transparent"
                >
                  <currentItem.icon className="w-24 h-24 mb-6 text-orange-800" />
                  <h3 className="text-2xl md:text-3xl font-black text-gray-800 text-center leading-tight">
                    {currentItem.name}
                  </h3>
                  
                  <p className="text-gray-500 text-sm mt-4 text-center px-2 line-clamp-3 font-medium">
                    {currentItem.description}
                  </p>

                  {/* 2-second timer bar */}
                  <div className="absolute bottom-0 left-0 w-full h-2 bg-gray-100 rounded-b-[2.5rem] overflow-hidden">
                    <motion.div
                      key={currentItem.id}
                      initial={{ width: '100%' }}
                      animate={{ width: '0%' }}
                      transition={{ duration: 2, ease: 'linear' }}
                      className="h-full bg-red-500"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom Mats Area */}
          <div className="h-48 md:h-64 w-full flex justify-center items-end px-2 md:px-6 pb-0 gap-2 md:gap-4 z-10">
            <MatButton 
              title="低風險" 
              icon={ShieldCheck}
              colorClass="border-green-400 text-green-400" 
              onClick={() => handleSort('low')} 
              shortcut="鍵盤 A / 地墊 Col 0"
            />
            <MatButton 
              title="中風險" 
              icon={TrendingUp}
              colorClass="border-yellow-400 text-yellow-400" 
              onClick={() => handleSort('medium')} 
              shortcut="鍵盤 S / 地墊 Col 1"
            />
            <MatButton 
              title="高風險" 
              icon={AlertTriangle}
              colorClass="border-red-400 text-red-400" 
              onClick={() => handleSort('high')} 
              shortcut="鍵盤 D / 地墊 Col 2"
            />
          </div>
        </div>
      )}

      {gameState === 'gameover' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/95 backdrop-blur-md p-8 rounded-[2rem] shadow-2xl w-full max-w-3xl mx-4 my-8 max-h-[90vh] flex flex-col"
        >
          <h2 className="text-4xl font-black text-gray-800 mb-2 text-center">時間到！</h2>
          <p className="text-gray-500 mb-6 text-lg font-medium text-center">遊戲結束，來看看你的表現</p>
          
          <div className="overflow-y-auto pr-2 flex-1 custom-scrollbar">
            {/* 統計數據區塊 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-blue-50 rounded-2xl p-4 text-center border border-blue-100">
                <p className="text-gray-500 text-sm font-bold mb-1">總得分</p>
                <p className="text-3xl font-black text-blue-600">{score}</p>
              </div>
              <div className="bg-green-50 rounded-2xl p-4 text-center border border-green-100">
                <p className="text-gray-500 text-sm font-bold mb-1">正確率</p>
                <p className="text-3xl font-black text-green-600">
                  {stats.totalAnswered > 0 ? Math.round((stats.correct / stats.totalAnswered) * 100) : 0}%
                </p>
              </div>
              <div className="bg-purple-50 rounded-2xl p-4 text-center border border-purple-100">
                <p className="text-gray-500 text-sm font-bold mb-1">總答題數</p>
                <p className="text-3xl font-black text-purple-600">{stats.totalAnswered}</p>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 text-center border border-orange-100">
                <p className="text-gray-500 text-sm font-bold mb-1">平均時間</p>
                <p className="text-3xl font-black text-orange-600">
                  {stats.totalAnswered > 0 ? (stats.totalResponseTime / stats.totalAnswered / 1000).toFixed(1) : 0}
                </p>
              </div>
            </div>

            {/* 錯誤題目回顧 */}
            {stats.incorrectItems.length > 0 ? (
              <div className="mb-4">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-500" />
                  錯誤題目回顧 ({stats.incorrectItems.length}題)
                </h3>
                <div className="space-y-3">
                  {stats.incorrectItems.map((wrong, idx) => (
                    <div key={idx} className="bg-red-50/50 border border-red-100 rounded-xl p-4 text-left flex flex-col md:flex-row gap-4 items-start md:items-center">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-800 text-lg">{wrong.item.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{wrong.item.description}</p>
                      </div>
                      <div className="flex flex-row md:flex-col gap-2 shrink-0 w-full md:w-auto">
                        <div className="flex items-center gap-1 text-sm font-bold px-3 py-1.5 bg-red-100 text-red-600 rounded-lg flex-1 md:flex-auto justify-center">
                          <XCircle className="w-4 h-4" />
                          你的選擇: {wrong.selectedRisk === 'timeout' ? '未作答(超時)' : riskMap[wrong.selectedRisk]}
                        </div>
                        <div className="flex items-center gap-1 text-sm font-bold px-3 py-1.5 bg-green-100 text-green-700 rounded-lg flex-1 md:flex-auto justify-center">
                          <CheckCircle2 className="w-4 h-4" />
                          正確分類: {riskMap[wrong.item.riskLevel]}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center mb-4">
                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">太厲害了！</h3>
                <p className="text-gray-600">你答對了所有題目，沒有任何錯誤！</p>
              </div>
            )}
          </div>

          <div className="flex gap-4 mt-6 pt-6 border-t border-gray-100 shrink-0">
            <button 
              onClick={() => exportCSV({ ...stats, score }, "理財知識分類_單次結算.csv")}
              className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-bold py-4 px-4 rounded-2xl text-lg transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg"
            >
              <Download className="w-5 h-5" />
              匯出本次紀錄
            </button>
            <button 
              onClick={() => setGameState('start')}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-2xl text-lg transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
            >
              <ArrowLeft className="w-5 h-5" />
              回首頁
            </button>
            <button 
              onClick={initGame}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-2xl text-lg transition-transform active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-green-500/30"
            >
              <RotateCcw className="w-5 h-5" />
              再玩一次
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

function MatButton({ title, icon: Icon, colorClass, onClick, shortcut }: { title: string, icon: React.ElementType, colorClass: string, onClick: () => void, shortcut?: string }) {
  const borderColor = colorClass.split(' ')[0];
  const textColor = colorClass.split(' ')[1];

  return (
    <motion.button
      whileTap={{ scale: 0.95, y: 10 }}
      onClick={onClick}
      className="flex-1 h-40 md:h-56 bg-[#3d434b] rounded-t-2xl relative flex flex-col items-center justify-center shadow-[0_-10px_30px_rgba(0,0,0,0.15)] overflow-hidden group border-b-0 pb-6 md:pb-8"
    >
      <div className={`absolute top-4 left-4 w-8 h-8 md:w-12 md:h-12 border-t-4 border-l-4 rounded-tl-xl ${borderColor} opacity-90`}></div>
      <div className={`absolute top-4 right-4 w-8 h-8 md:w-12 md:h-12 border-t-4 border-r-4 rounded-tr-xl ${borderColor} opacity-90`}></div>
      
      <div className="absolute bottom-[-60%] w-[120%] aspect-square rounded-full border-[6px] border-white/5 pointer-events-none"></div>

      <Icon className={`w-10 h-10 md:w-16 md:h-16 mb-2 md:mb-4 opacity-90 group-hover:scale-110 transition-transform ${textColor}`} />
      <span className="text-white font-bold text-xl md:text-3xl tracking-widest drop-shadow-md">{title}</span>
      {shortcut && (
        <span className="absolute bottom-3 md:bottom-4 text-white/60 font-bold text-xs md:text-sm bg-black/30 px-3 py-1 rounded-lg">
          按 {shortcut} 鍵
        </span>
      )}
    </motion.button>
  );
}
