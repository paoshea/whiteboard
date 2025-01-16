import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Camera, Eraser, Tag, PlusCircle, ChevronLeft, ChevronRight, Copy,
  Edit2, Trash2, Layout, ChevronUp, ChevronDown, Files, Search,
  Folder, FolderPlus, Upload, Download, Users, Filter, Share2,
  SlidersHorizontal, Clock, Star, UserPlus, Save, History
} from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card'; 
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input'; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/DropdownMenu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/Tabs";

// Collaboration Types
type Collaborator = {
  email: string;
  permission: 'view' | 'comment' | 'edit';
  lastAccess?: Date;
};

type Page = {
  id: string;
  name: string;
  content: string | null;
  tags: string[];
  folderId: string;
  created: Date;
  modified: Date;
  isStarred: boolean;
  collaborators: Collaborator[];
  owner: string;
  permissions: 'edit' | 'view' | 'comment';
  version: number;
  history: Array<{
    content: string;
    timestamp: Date;
    author: string;
  }>;
};

const WaterfallLogo = () => (
  <svg className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 h-1/2 opacity-70 pointer-events-none" viewBox="0 0 100 100">
    <defs>
      <linearGradient id="waterfall" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" style={{ stopColor: '#4a9eff', stopOpacity: 0.4 }} />
        <stop offset="100%" style={{ stopColor: '#0066cc', stopOpacity: 0.3 }} />
      </linearGradient>
    </defs>
    <path
      d="M30,0 C30,30 70,30 70,50 C70,70 30,70 30,100 M40,0 C40,20 60,20 60,40 C60,60 40,60 40,100 M50,0 C50,25 65,25 65,45 C65,65 50,65 50,100"
      stroke="url(#waterfall)"
      fill="none"
      strokeWidth="2"
    />
  </svg>
);

const Whiteboard = () => {
  const canvasRef = useRef(null);
  const [pages, setPages] = useState([{
    id: Date.now().toString(), name: 'Page 1', content: null, tags: [], folderId: 'root', created: new Date(), modified: new Date(), isStarred: false, collaborators: [], owner: 'current-user', permissions: 'edit', version: 1, history: []
  }]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const [isDrawing, setIsDrawing] = useState(false);
  const [context, setContext] = useState(null);
  const [currentTag, setCurrentTag] = useState('');
  const [color, setColor] = useState('#000000');
  const [lineWidth, setLineWidth] = useState(2);
  const [lastPoint, setLastPoint] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const updateCanvasSize = () => {
      canvas.width = canvas.parentElement.offsetWidth;
      canvas.height = canvas.parentElement.offsetHeight;
    };

    updateCanvasSize();
    const ctx = canvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    setContext(ctx);

    window.addEventListener('resize', updateCanvasSize);
    return () => window.removeEventListener('resize', updateCanvasSize);
  }, [currentPageIndex]);

  const saveCurrentPage = useCallback(() => {
    const newPages = [...pages];
    newPages[currentPageIndex] = {
      ...newPages[currentPageIndex],
      content: canvasRef.current.toDataURL(),
      modified: new Date()
    };
    setPages(newPages);
  }, [pages, currentPageIndex]);

  const startDrawing = (e) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    setLastPoint(point);
    setIsDrawing(true);
    context.beginPath();
    context.moveTo(point.x, point.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const point = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    context.lineTo(point.x, point.y);
    context.strokeStyle = color;
    context.lineWidth = lineWidth;
    context.stroke();
  };

  const stopDrawing = () => {
    context.closePath();
    setIsDrawing(false);
    saveCurrentPage();
  };

  const clearCanvas = () => {
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveCurrentPage();
  };

  const takeScreenshot = () => {
    const link = document.createElement('a');
    link.download = `${pages[currentPageIndex].name}.png`;
    link.href = canvasRef.current.toDataURL();
    link.click();
  };

  const addTag = (e) => {
    e.preventDefault();
    if (currentTag.trim() && !pages[currentPageIndex].tags.includes(currentTag.trim())) {
      const newPages = [...pages];
      newPages[currentPageIndex].tags.push(currentTag.trim());
      setPages(newPages);
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    const newPages = [...pages];
    newPages[currentPageIndex].tags = newPages[currentPageIndex].tags.filter(tag => tag !== tagToRemove);
    setPages(newPages);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto h-screen flex flex-col">
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex gap-2 mb-4">
            <Button onClick={clearCanvas} variant="outline" className="flex items-center gap-2">
              <Eraser className="w-4 h-4" /> Clear
            </Button>
            <Button onClick={takeScreenshot} variant="outline" className="flex items-center gap-2">
              <Camera className="w-4 h-4" /> Screenshot
            </Button>
            <Input type="color" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-9 p-1" />
            <Input type="number" value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} min="1" max="20" className="w-20" />
          </div>
          <form onSubmit={addTag} className="flex gap-2 mb-4">
            <Input type="text" value={currentTag} onChange={(e) => setCurrentTag(e.target.value)} placeholder="Add a tag..." className="flex-1" />
            <Button type="submit" variant="outline" className="flex items-center gap-2">
              <Tag className="w-4 h-4" /> Add Tag
            </Button>
          </form>
          {pages[currentPageIndex].tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {pages[currentPageIndex].tags.map(tag => (
                <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-sm flex items-center gap-1">
                  {tag}
                  <button onClick={() => removeTag(tag)} className="text-gray-500 hover:text-gray-700">×</button>
                </span>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="border rounded-lg overflow-hidden relative flex-grow">
        <WaterfallLogo />
        <canvas ref={canvasRef} className="w-full h-full bg-white cursor-crosshair" onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseOut={stopDrawing} />
      </div>

      <footer className="mt-4 flex items-center justify-between bg-white p-4 border rounded-lg">
        <div className="flex items-center gap-2">
          <Button onClick={() => setCurrentPageIndex((prev) => Math.max(prev - 1, 0))} disabled={currentPageIndex === 0} variant="outline" size="icon">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <span className="text-sm">Page {currentPageIndex + 1} of {pages.length}</span>
          <Button onClick={() => setCurrentPageIndex((prev) => Math.min(prev + 1, pages.length - 1))} disabled={currentPageIndex === pages.length - 1} variant="outline" size="icon">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => setPages([...pages, { id: Date.now().toString(), name: `Page ${pages.length + 1}`, content: null, tags: [], created: new Date(), modified: new Date(), folderId: 'root', isStarred: false, collaborators: [], owner: 'current-user', permissions: 'edit', version: 1, history: [] }])} variant="default" className="flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> New Page
          </Button>
        </div>
      </footer>
    </div>
  );
};

export default Whiteboard;