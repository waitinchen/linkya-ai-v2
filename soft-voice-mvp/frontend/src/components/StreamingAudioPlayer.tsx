import React, { useEffect, useMemo, useRef, useState } from 'react';

type StreamAudioPlayerProps = {
  stream?: ReadableStream<Uint8Array>;
  mimeType?: string;
  autoPlay?: boolean;
  className?: string;
};

const FALLBACK_TYPE = 'audio/mpeg';

function supportsMediaSource(type: string) {
  return typeof window !== 'undefined' && 'MediaSource' in window && MediaSource.isTypeSupported(type);
}

export default function StreamingAudioPlayer({
  stream,
  mimeType = FALLBACK_TYPE,
  autoPlay = true,
  className,
}: StreamAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isBuffering, setIsBuffering] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const safeMime = useMemo(() => mimeType || FALLBACK_TYPE, [mimeType]);

  useEffect(() => {
    if (!stream || !audioRef.current) {
      return;
    }

    const audioEl = audioRef.current;
    let cancelled = false;
    let mediaSource: MediaSource | null = null;
    let objectUrl: string | null = null;
    let sourceBuffer: SourceBuffer | null = null;
    let reading = true;

    audioEl.autoplay = autoPlay;

    const startPlayback = async () => {
      if (supportsMediaSource(safeMime)) {
        mediaSource = new MediaSource();
        objectUrl = URL.createObjectURL(mediaSource);
        audioEl.src = objectUrl;

        const reader = stream.getReader();
        const bufferQueue: ArrayBuffer[] = [];

        const feedNext = async () => {
          if (!sourceBuffer || cancelled || !reading) return;
          if (sourceBuffer.updating) return;

          if (bufferQueue.length > 0) {
            const chunk = bufferQueue.shift();
            if (chunk) {
              sourceBuffer.appendBuffer(chunk);
              return;
            }
          }

          try {
            const { value, done } = await reader.read();
            if (cancelled || !sourceBuffer) return;

            if (done) {
              reading = false;
              if (!sourceBuffer.updating) {
                mediaSource?.endOfStream();
              }
              return;
            }

            if (value) {
              const chunk = value.buffer.slice(value.byteOffset, value.byteOffset + value.byteLength);
              bufferQueue.push(chunk);
              feedNext();
            }
          } catch (err) {
            if (!cancelled) {
              setError(err instanceof Error ? err.message : '音訊串流失敗');
            }
          }
        };

        mediaSource.addEventListener('sourceopen', () => {
          if (!mediaSource) return;
          try {
            sourceBuffer = mediaSource.addSourceBuffer(safeMime);
            sourceBuffer.mode = 'sequence';
            sourceBuffer.addEventListener('updateend', () => {
              feedNext();
            });
            feedNext();
          } catch (err) {
            setError(err instanceof Error ? err.message : '無法建立音訊緩衝區');
          }
        });
      } else {
        // Fallback: accumulate into Blob
        const reader = stream.getReader();
        const chunks: Uint8Array[] = [];

        try {
          while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            if (value) chunks.push(value);
          }

          if (!cancelled) {
            const blob = new Blob(chunks, { type: safeMime });
            objectUrl = URL.createObjectURL(blob);
            audioEl.src = objectUrl;
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : '音訊串流失敗');
        } finally {
          reading = false;
        }
      }
    };

    startPlayback()
      .then(() => {
        if (autoPlay) {
          audioEl
            .play()
            .catch(() => {
              // 使用者可能未互動導致自動播放失敗
            });
        }
      })
      .finally(() => setIsBuffering(false));

    return () => {
      cancelled = true;
      reading = false;
      if (sourceBuffer) {
        try {
          sourceBuffer.abort();
        } catch {
          /* ignore */
        }
      }
      if (mediaSource && mediaSource.readyState === 'open') {
        try {
          mediaSource.endOfStream();
        } catch {
          /* ignore */
        }
      }
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [stream, autoPlay, safeMime]);

  return (
    <div className={className}>
      {isBuffering && <span className="text-xs text-soft-pink-600 mr-2">語音緩衝中…</span>}
      {error && <span className="text-xs text-red-500 mr-2">語音播放失敗：{error}</span>}
      <audio ref={audioRef} controls className="flex-1 h-8" />
    </div>
  );
}
