import { useState } from 'react';
import { Image, SlidersHorizontal, RotateCw, Wand2, Undo2, Upload, FileText } from 'lucide-react';

interface QueueItem {
  name: string;
  status: 'pending' | 'processing' | 'done';
}

function Scan() {
  const [contrast, setContrast] = useState(50);
  const [brightness, setBrightness] = useState(50);
  const [angle, setAngle] = useState(0);
  const [queue, setQueue] = useState<QueueItem[]>([
    { name: '发票扫描件.pdf', status: 'done' },
    { name: '合同扫描件-01.jpg', status: 'processing' },
    { name: '手写笔记.png', status: 'pending' },
  ]);

  const reset = () => {
    setContrast(50);
    setBrightness(50);
    setAngle(0);
  };

  return (
    <div className="flex h-[calc(100vh-140px)] gap-4 animate-fade-in">
      <aside className="w-72 flex-shrink-0 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-teal-600" />
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">图像参数</h3>
        </div>

        <div className="mt-5 space-y-5">
          <div>
            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>对比度</span>
              <span>{contrast}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={contrast}
              onChange={(e) => setContrast(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
          </div>

          <div>
            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>亮度</span>
              <span>{brightness}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={brightness}
              onChange={(e) => setBrightness(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
          </div>

          <div>
            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>旋转角度 (°)</span>
              <span>{angle}</span>
            </div>
            <input
              type="number"
              value={angle}
              onChange={(e) => setAngle(Number(e.target.value))}
              className="w-full rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-sm outline-none transition-all duration-200 focus:border-teal-400 focus:ring-2 focus:ring-teal-100 dark:focus:ring-teal-900/60"
            />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            <RotateCw className="h-3.5 w-3.5" />
            纠偏
          </button>
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            <RotateCw className="h-3.5 w-3.5" />
            旋转 90°
          </button>
          <button
            type="button"
            className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg bg-gradient-to-r from-teal-500 to-teal-700 px-3 py-2 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:brightness-105"
          >
            <Wand2 className="h-3.5 w-3.5" />
            一键优化
          </button>
          <button
            type="button"
            onClick={reset}
            className="col-span-2 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-700 px-3 py-2 text-xs text-slate-600 dark:text-slate-300 transition-all duration-200 hover:bg-slate-50 dark:hover:bg-slate-600"
          >
            <Undo2 className="h-3.5 w-3.5" />
            重置参数
          </button>
        </div>

        <div className="mt-6 border-t border-slate-100 dark:border-slate-700 pt-5">
          <button
            type="button"
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-900 dark:bg-slate-700 px-3 py-2.5 text-xs font-medium text-white transition-all duration-200 hover:bg-slate-700 dark:hover:bg-slate-600"
          >
            <Upload className="h-3.5 w-3.5" />
            上传扫描件
          </button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="border-b border-slate-100 dark:border-slate-700 px-5 py-3 text-xs text-slate-500">
          预览区 · 对比度 {contrast}% · 亮度 {brightness}% · 旋转 {angle}°
        </div>
        <div className="flex flex-1 items-center justify-center bg-slate-50 dark:bg-slate-900 p-8">
          <div className="flex flex-col items-center justify-center text-slate-400">
            <Image className="h-20 w-20" />
            <p className="mt-4 text-sm">请选择扫描图片进行处理</p>
            <p className="mt-1 text-xs">支持 JPG、PNG、PDF 等常见格式</p>
          </div>
        </div>
      </div>

      <aside className="w-72 flex-shrink-0 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">处理队列</h3>
        <div className="mt-4 space-y-2">
          {queue.map((q, idx) => {
            const badge =
              q.status === 'done'
                ? 'bg-teal-100 text-teal-700 dark:bg-teal-900/60 dark:text-teal-300'
                : q.status === 'processing'
                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/60 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-300';
            const label = q.status === 'done' ? '已完成' : q.status === 'processing' ? '处理中' : '待处理';
            return (
              <div
                key={idx}
                className="flex items-center gap-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40 p-3 transition-all duration-200 hover:bg-white dark:hover:bg-slate-700/40"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                  <FileText className="h-4 w-4 text-teal-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                    {q.name}
                  </div>
                  <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-[10px] ${badge}`}>
                    {label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
        <button
          type="button"
          onClick={() =>
            setQueue((q) => [...q, { name: `新文件-${q.length + 1}.jpg`, status: 'pending' }])
          }
          className="mt-4 w-full rounded-lg border border-dashed border-slate-300 dark:border-slate-600 py-2 text-xs text-slate-500 transition-all duration-200 hover:border-teal-400 hover:text-teal-600"
        >
          + 添加到队列
        </button>
      </aside>
    </div>
  );
}

export default Scan;
