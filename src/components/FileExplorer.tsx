import { useState, useEffect } from 'react';
import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  FileText,
  Upload,
  Grid3X3,
  List,
} from 'lucide-react';
import type { FileItem, TreeNode } from '@/types/api';

interface FileExplorerProps {
  onSelectFile?: (file: FileItem) => void;
  showAiPanel?: boolean;
}

const mockTree: TreeNode[] = [
  {
    name: 'work',
    path: '/work',
    isDir: true,
    children: [
      {
        name: '合同',
        path: '/work/合同',
        isDir: true,
        children: [
          { name: '2024合同.pdf', path: '/work/合同/2024合同.pdf', isDir: false },
          { name: '服务协议.docx', path: '/work/合同/服务协议.docx', isDir: false },
        ],
      },
      {
        name: '财务',
        path: '/work/财务',
        isDir: true,
        children: [
          { name: '发票扫描件.pdf', path: '/work/财务/发票扫描件.pdf', isDir: false },
          { name: '季度报表.xlsx', path: '/work/财务/季度报表.xlsx', isDir: false },
        ],
      },
      { name: 'README.md', path: '/work/README.md', isDir: false },
    ],
  },
];

const mockFiles: Record<string, FileItem[]> = {
  '/': [
    { path: '/work', name: 'work', isDir: true, size: 0, mtime: '2026-06-18 09:00' },
  ],
  '/work': [
    { path: '/work/合同', name: '合同', isDir: true, size: 0, mtime: '2026-06-18 09:00' },
    { path: '/work/财务', name: '财务', isDir: true, size: 0, mtime: '2026-06-15 14:22' },
    { path: '/work/README.md', name: 'README.md', isDir: false, size: 2048, mtime: '2026-06-10 10:11', ext: 'md' },
  ],
  '/work/合同': [
    { path: '/work/合同/2024合同.pdf', name: '2024合同.pdf', isDir: false, size: 245760, mtime: '2026-06-18 09:00', ext: 'pdf' },
    { path: '/work/合同/服务协议.docx', name: '服务协议.docx', isDir: false, size: 102400, mtime: '2026-06-16 15:30', ext: 'docx' },
  ],
  '/work/财务': [
    { path: '/work/财务/发票扫描件.pdf', name: '发票扫描件.pdf', isDir: false, size: 512000, mtime: '2026-06-12 11:00', ext: 'pdf' },
    { path: '/work/财务/季度报表.xlsx', name: '季度报表.xlsx', isDir: false, size: 81920, mtime: '2026-06-10 16:40', ext: 'xlsx' },
  ],
};

function formatSize(size: number): string {
  if (size === 0) return '-';
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(2)} MB`;
}

interface TreeNodeViewProps {
  node: TreeNode;
  level: number;
  currentPath: string;
  onSelect: (path: string, isDir: boolean) => void;
}

function TreeNodeView({ node, level, currentPath, onSelect }: TreeNodeViewProps) {
  const [expanded, setExpanded] = useState(level < 1);
  const hasChildren = node.isDir && node.children && node.children.length > 0;
  const active = currentPath === node.path;

  return (
    <div>
      <div
        className={`flex cursor-pointer items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm transition-all duration-200 ${
          active
            ? 'bg-teal-50 text-teal-700 dark:bg-slate-700 dark:text-teal-300'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
        style={{ paddingLeft: level * 14 + 8 }}
        onClick={() => {
          if (node.isDir) {
            setExpanded((v) => !v);
            onSelect(node.path, true);
          } else {
            onSelect(node.path, false);
          }
        }}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          ) : (
            <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
          )
        ) : (
          <span className="inline-block h-3.5 w-3.5" />
        )}
        {node.isDir ? (
          expanded ? (
            <FolderOpen className="h-4 w-4 text-amber-500" />
          ) : (
            <Folder className="h-4 w-4 text-amber-500" />
          )
        ) : (
          <FileText className="h-4 w-4 text-slate-400" />
        )}
        <span className="truncate">{node.name}</span>
      </div>
      {expanded && hasChildren && (
        <div>
          {node.children!.map((child) => (
            <TreeNodeView
              key={child.path}
              node={child}
              level={level + 1}
              currentPath={currentPath}
              onSelect={onSelect}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FileExplorer({ onSelectFile, showAiPanel = true }: FileExplorerProps) {
  const [currentPath, setCurrentPath] = useState('/work');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [files, setFiles] = useState<FileItem[]>(mockFiles['/work'] || []);

  useEffect(() => {
    const data = mockFiles[currentPath] || [];
    setFiles(data);
  }, [currentPath]);

  const crumbs = currentPath.split('/').filter(Boolean);

  const handlePick = (file: FileItem) => {
    if (file.isDir) {
      setCurrentPath(file.path);
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
      onSelectFile?.(file);
    }
  };

  void showAiPanel;

  return (
    <div className="flex h-full gap-4">
      <div className="w-60 flex-shrink-0 rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 p-3 shadow-sm">
        <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">目录</div>
        <div className="max-h-[520px] overflow-y-auto custom-scrollbar">
          {mockTree.map((n) => (
            <TreeNodeView
              key={n.path}
              node={n}
              level={0}
              currentPath={currentPath}
              onSelect={(p, isDir) => {
                if (isDir) setCurrentPath(p);
              }}
            />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col rounded-2xl border border-slate-200 bg-white dark:bg-slate-800 dark:border-slate-700 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 px-4 py-3">
          <div className="flex items-center gap-1 text-sm">
            <span className="text-slate-500">路径：</span>
            <span className="text-slate-700 dark:text-slate-200">/</span>
            {crumbs.map((c, idx) => (
              <span key={idx} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3 text-slate-300" />
                <span className="text-slate-700 dark:text-slate-200">{c}</span>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg bg-teal-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition-all duration-200 hover:bg-teal-700"
            >
              <Upload className="h-3.5 w-3.5" />
              上传文件
            </button>
            <div className="flex overflow-hidden rounded-lg border border-slate-200 dark:border-slate-600">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-teal-50 text-teal-700 dark:bg-slate-700 dark:text-teal-300'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <Grid3X3 className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1 px-2.5 py-1.5 text-xs transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-teal-50 text-teal-700 dark:bg-slate-700 dark:text-teal-300'
                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {files.map((file) => {
                const active = selectedFile?.path === file.path;
                return (
                  <div
                    key={file.path}
                    onClick={() => handlePick(file)}
                    className={`group flex cursor-pointer flex-col items-center rounded-2xl border p-4 text-center transition-all duration-200 hover:-translate-y-0.5 ${
                      active
                        ? 'border-teal-400 bg-teal-50 dark:bg-slate-700'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:border-teal-300 hover:bg-white hover:shadow-sm'
                    }`}
                  >
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-white dark:bg-slate-800 shadow-sm">
                      {file.isDir ? (
                        <Folder className="h-6 w-6 text-amber-500" />
                      ) : (
                        <FileText className="h-6 w-6 text-teal-600" />
                      )}
                    </div>
                    <div className="w-full truncate text-sm font-medium text-slate-700 dark:text-slate-200">
                      {file.name}
                    </div>
                    <div className="mt-0.5 text-xs text-slate-400">
                      {file.isDir ? '文件夹' : formatSize(file.size)}
                    </div>
                  </div>
                );
              })}
              {files.length === 0 && (
                <div className="col-span-full py-20 text-center text-sm text-slate-400">
                  该目录下暂无文件
                </div>
              )}
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {files.map((file) => {
                const active = selectedFile?.path === file.path;
                return (
                  <div
                    key={file.path}
                    onClick={() => handlePick(file)}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                      active
                        ? 'bg-teal-50 dark:bg-slate-700'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {file.isDir ? (
                      <Folder className="h-4 w-4 text-amber-500" />
                    ) : (
                      <FileText className="h-4 w-4 text-teal-600" />
                    )}
                    <span className="flex-1 truncate text-slate-700 dark:text-slate-200">{file.name}</span>
                    <span className="w-20 text-xs text-slate-400">
                      {file.isDir ? '-' : formatSize(file.size)}
                    </span>
                    <span className="w-36 text-xs text-slate-400">{file.mtime}</span>
                  </div>
                );
              })}
              {files.length === 0 && (
                <div className="py-20 text-center text-sm text-slate-400">该目录下暂无文件</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FileExplorer;
