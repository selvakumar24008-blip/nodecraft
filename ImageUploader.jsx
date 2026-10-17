import React, { useState, useRef } from 'react';
import { Upload, Image as ImageIcon, Sliders, Check, AlertCircle, Loader2, RefreshCw } from 'lucide-react';

export default function ImageUploader({
  currentUrl,
  onImageUploaded,
  authToken,
  defaultPreset = 'avatar', // 'avatar' (400x400) or 'project' (800x600)
  label = 'Upload Team Member Photo (JPG format)'
}) {
  const [selectedPreset, setSelectedPreset] = useState(defaultPreset);
  const [customWidth, setCustomWidth] = useState(defaultPreset === 'avatar' ? 400 : 800);
  const [customHeight, setCustomHeight] = useState(defaultPreset === 'avatar' ? 400 : 600);
  const [quality, setQuality] = useState(90);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentUrl || '');
  const [fileDetails, setFileDetails] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const presets = [
    { id: 'avatar', label: 'Avatar Square (400 × 400)', width: 400, height: 400 },
    { id: 'avatar-hd', label: 'HD Avatar (600 × 600)', width: 600, height: 600 },
    { id: 'project', label: 'Project Card (800 × 600)', width: 800, height: 600 },
    { id: 'banner', label: 'Widescreen (1200 × 800)', width: 1200, height: 800 },
    { id: 'custom', label: 'Custom Dimensions', width: customWidth, height: customHeight },
  ];

  const handlePresetChange = (presetId) => {
    setSelectedPreset(presetId);
    const found = presets.find((p) => p.id === presetId);
    if (found && presetId !== 'custom') {
      setCustomWidth(found.width);
      setCustomHeight(found.height);
    }
  };

  // Resize and convert image to JPG using HTML5 Canvas
  const processAndResizeToJpg = (file, targetWidth, targetHeight, targetQuality) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = (e) => {
        const img = new Image();
        img.onerror = reject;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          const ctx = canvas.getContext('2d');

          // White background for JPEG conversion (prevents black background on transparent PNGs)
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, targetWidth, targetHeight);

          // Calculate center-crop / cover fit
          const imgAspect = img.width / img.height;
          const targetAspect = targetWidth / targetHeight;
          let renderW = targetWidth;
          let renderH = targetHeight;
          let renderX = 0;
          let renderY = 0;

          if (imgAspect > targetAspect) {
            renderW = targetHeight * imgAspect;
            renderX = (targetWidth - renderW) / 2;
          } else {
            renderH = targetWidth / imgAspect;
            renderY = (targetHeight - renderH) / 2;
          }

          ctx.drawImage(img, renderX, renderY, renderW, renderH);

          // Export as image/jpeg
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve({
                  blob,
                  dataUrl: canvas.toDataURL('image/jpeg', targetQuality / 100),
                  width: targetWidth,
                  height: targetHeight
                });
              } else {
                reject(new Error('Canvas export failed'));
              }
            },
            'image/jpeg',
            targetQuality / 100
          );
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setUploading(true);

    try {
      const activeWidth = selectedPreset === 'custom' ? parseInt(customWidth, 10) || 400 : (presets.find(p => p.id === selectedPreset)?.width || 400);
      const activeHeight = selectedPreset === 'custom' ? parseInt(customHeight, 10) || 400 : (presets.find(p => p.id === selectedPreset)?.height || 400);

      // Process and convert directly to clean JPG at target resolution
      const { blob, dataUrl, width, height } = await processAndResizeToJpg(
        file,
        activeWidth,
        activeHeight,
        quality
      );

      setPreviewUrl(dataUrl);
      setFileDetails({
        name: file.name.replace(/\.[^/.]+$/, '') + '.jpg',
        sizeKb: Math.round(blob.size / 1024),
        width,
        height
      });

      // Prepare FormData to upload JPG to backend
      const formData = new FormData();
      formData.append('image', blob, 'team_member.jpg');
      formData.append('width', width);
      formData.append('height', height);
      formData.append('quality', quality);

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${authToken}`
        },
        body: formData
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to upload image');
      }

      onImageUploaded(data.url);
    } catch (err) {
      console.error('Image upload error:', err);
      setError(err.message || 'Failed to process and upload image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      style={{
        padding: '1.25rem',
        borderRadius: 'var(--radius-md)',
        background: '#F8FAFC',
        border: '1px solid rgba(15, 23, 42, 0.1)',
        marginBottom: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <label className="form-label" style={{ marginBottom: 0 }}>
          {label}
        </label>
        <span className="badge badge-blue">Required: JPG Format</span>
      </div>

      {/* Resize Preset Options */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 600 }}>
          <Sliders size={13} />
          <span>Image Resize Presets</span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
          {presets.map((p) => {
            const isSelected = selectedPreset === p.id;
            return (
              <button
                type="button"
                key={p.id}
                onClick={() => handlePresetChange(p.id)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 700 : 500,
                  background: isSelected ? 'var(--gradient-accent)' : '#FFFFFF',
                  color: isSelected ? '#FFFFFF' : 'var(--text-secondary)',
                  border: isSelected ? '1px solid transparent' : '1px solid rgba(15, 23, 42, 0.12)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(37, 99, 235, 0.25)' : 'none',
                }}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Custom Dimensions Input Row */}
        {selectedPreset === 'custom' && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginTop: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>W:</span>
              <input
                type="number"
                min="100"
                max="2400"
                value={customWidth}
                onChange={(e) => setCustomWidth(Number(e.target.value))}
                className="form-input"
                style={{ width: '85px', padding: '0.35rem 0.5rem', fontSize: '0.82rem' }}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>px</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>H:</span>
              <input
                type="number"
                min="100"
                max="2400"
                value={customHeight}
                onChange={(e) => setCustomHeight(Number(e.target.value))}
                className="form-input"
                style={{ width: '85px', padding: '0.35rem 0.5rem', fontSize: '0.82rem' }}
              />
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>px</span>
            </div>
          </div>
        )}
      </div>

      {/* Upload Zone & Preview Split */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: previewUrl ? '100px 1fr' : '1fr',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {/* Preview Thumbnail */}
        {previewUrl && (
          <div
            style={{
              width: '100px',
              height: '100px',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              border: '2px solid rgba(37, 99, 235, 0.3)',
              position: 'relative',
              background: '#FFFFFF',
              boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
            }}
          >
            <img
              src={previewUrl}
              alt="Preview"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <span
              style={{
                position: 'absolute',
                bottom: '2px',
                right: '2px',
                background: 'rgba(15, 23, 42, 0.85)',
                color: '#FFFFFF',
                fontSize: '0.62rem',
                padding: '1px 4px',
                borderRadius: '3px',
                fontWeight: 700,
              }}
            >
              JPG
            </span>
          </div>
        )}

        {/* Upload Trigger Dropzone */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '1rem 1.25rem',
              border: '2px dashed rgba(37, 99, 235, 0.35)',
              borderRadius: 'var(--radius-md)',
              background: '#FFFFFF',
              cursor: uploading ? 'not-allowed' : 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            {uploading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem' }}>
                <Loader2 size={18} className="spinner" style={{ animation: 'spinSlow 1s linear infinite', color: 'var(--accent-electric)' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  Resizing &amp; Uploading JPG...
                </span>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.65rem' }}>
                <Upload size={18} color="var(--accent-electric)" />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    Click to browse JPG photo from device
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Auto-resizes to {selectedPreset === 'custom' ? `${customWidth}×${customHeight}` : presets.find(p => p.id === selectedPreset)?.label}
                  </div>
                </div>
              </div>
            )}
          </div>

          {fileDetails && (
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-emerald)', marginTop: '0.45rem', fontWeight: 600 }}>
              ✓ Processed: {fileDetails.name} ({fileDetails.width}×{fileDetails.height}px, {fileDetails.sizeKb} KB)
            </div>
          )}

          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: 'var(--accent-rose)', marginTop: '0.45rem' }}>
              <AlertCircle size={14} />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
