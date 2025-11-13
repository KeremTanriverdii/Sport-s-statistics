import {
  HttpEvent,
  HttpRequest,
  HttpResponse,
  HttpInterceptorFn, // HttpInterceptor'ı HttpInterceptorFn olarak değiştirdik
  HttpHandlerFn, // HttpHandler'ı HttpHandlerFn olarak değiştirdik
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { tap } from 'rxjs/operators';

// Önbelleğe alacağımız veriler için bir isim.
const CACHE_NAME = 'api-cache-v1';

/**
 * Bu artık bir sınıf değil, doğrudan 'provideHttpClient(withInterceptors([...]))'
 * içinde kullanılabilen bir "Fonksiyonel Interceptor".
 */
export const cacheInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn // next'in tipi HttpHandlerFn olarak güncellendi
): Observable<HttpEvent<any>> => {
  // 1. Sadece 'GET' isteklerini önbelleğe al.
  if (req.method !== 'GET') {
    return next(req); // 'next.handle(req)' yerine 'next(req)' olarak çağrılır
  }

  // 2. Cache API (Promise tabanlı) ile RxJS (Observable tabanlı)
  // dünyasını birleştir. `from` operatörü Promise'i Observable'a çevirir.
  return from(handleCache(req, next));
};

/**
 * Asıl önbellek mantığını yöneten asenkron fonksiyon.
 * (Sınıfın private metoduydu, şimdi dosya içinde yardımcı fonksiyon oldu)
 */
async function handleCache(
  req: HttpRequest<any>,
  next: HttpHandlerFn // next'in tipi HttpHandlerFn olarak güncellendi
): Promise<HttpEvent<any>> {
  // 3. Önbelleğimizi açıyoruz.
  const cache = await caches.open(CACHE_NAME);

  // 4. Bu isteğe (req) uygun bir yanıt önbellekte var mı diye bakıyoruz.
  // Sizin yaptığınız 'urlWithParams' değişikliği korundu, bu doğru.
  const cachedResponse = await cache.match(req.urlWithParams);

  // 5. SENARYO A: Önbellekte yanıt VAR
  if (cachedResponse) {
    // Önbellekteki yanıtı Angular'ın anlayacağı 'HttpResponse' objesine çeviriyoruz.
    return createAngularResponse(cachedResponse);
  }

  // 6. SENARYO B: Önbellekte yanıt YOK
  // 'next(req)' fonksiyonu bir Observable döndürür.
  return (
    next(req) // 'next.handle(req)' yerine 'next(req)' olarak çağrılır
      .pipe(
        tap((event) => {
          if (event instanceof HttpResponse) {
            // Yanıt geldiyse, bunu asenkron olarak önbelleğe kaydediyoruz.
            cacheResponse(cache, req, event.clone());
          }
        })
      )
      .toPromise() as Promise<HttpEvent<any>>
  ); // Sizin 'as Promise' değişikliğiniz korundu.
}

/**
 * API'den gelen Angular 'HttpResponse' objesini önbelleğe kaydeder.
 * (Sınıfın private metoduydu, şimdi dosya içinde yardımcı fonksiyon oldu)
 */
async function cacheResponse(
  cache: Cache,
  req: HttpRequest<any>,
  res: HttpResponse<any>
): Promise<void> {
  try {
    const bodyBlob = new Blob([JSON.stringify(res.body)], {
      type: 'application/json',
    });

    const responseToCache = new Response(bodyBlob, {
      status: res.status,
      statusText: res.statusText,
      headers: headersToBrowserHeaders(res.headers),
    });

    // Sizin 'urlWithParams' değişikliğiniz korundu.
    await cache.put(req.urlWithParams, responseToCache);
  } catch (error) {
    console.error('CacheInterceptor - CacheResponse Hatası:', error);
  }
}

/**
 * Önbellekten okunan standart 'Response' objesini 'HttpResponse' objesine çevirir.
 * (Sınıfın private metoduydu, şimdi dosya içinde yardımcı fonksiyon oldu)
 */
async function createAngularResponse(
  res: Response
): Promise<HttpResponse<any>> {
  const body = await res.json();
  return new HttpResponse({
    body: body,
    status: res.status,
    statusText: res.statusText,
    headers: browserHeadersToHttpHeaders(res.headers),
  });
}

// --- Yardımcı Fonksiyonlar (Tip Dönüşümü) ---
// (Sınıfın private metodlarıydı, şimdi dosya içinde yardımcı fonksiyon oldular)

function headersToBrowserHeaders(headers: any): Headers {
  const browserHeaders = new Headers();
  headers.keys().forEach((key: string) => {
    browserHeaders.append(key, headers.get(key));
  });
  return browserHeaders;
}

function browserHeadersToHttpHeaders(headers: Headers): any {
  const httpHeaders: { [key: string]: string } = {};
  headers.forEach((value, key) => {
    httpHeaders[key] = value;
  });
  return httpHeaders;
}