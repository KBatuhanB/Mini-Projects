import { test, expect } from '@playwright/test';

test('test', async ({ page, context }) => {

  await page.goto('https://www.trendyol.com/');
  await page.getByRole('button', { name: 'Tümünü Kabul Et' }).click();
  console.log("Trendyol anasayfa açıldı ve çerezler kabul edildi.");

  // Kategori seçme
  await page.getByRole('link', { name: 'Elektronik' }).waitFor();
  await page.getByRole('link', { name: 'Elektronik' }).click();
  console.log("Elektronik kategorisi seçildi.");

  // Alt kategori seçme
  await expect(page.getByRole('link', { name: 'Bilgisayar Bileşenleri' })).toBeVisible();
  await page.getByText('Aradığın Tüm Kategoriler').waitFor();
  await page.locator('.shadow').click();
  await page.getByRole('link', { name: 'Bilgisayar Bileşenleri' }).click();
  console.log("Bilgisayar Bileşenleri alt kategorisi seçildi.");

  // Fiyat filtreleme
  await page.locator('div').filter({ hasText: /^Fiyat$/ }).nth(1).click();
  await page.waitForTimeout(1000);
  await page.getByRole('textbox', { name: 'En Az' }).fill('1000');
  await page.getByRole('textbox', { name: 'En Çok' }).fill('5000');
  await page.locator('#sticky-aggregations').getByRole('button').click();
  await page.waitForTimeout(2000);
  console.log("Fiyat filtrelemesi 1000-5000 TL olarak yapıldı.");

  // İlk ürüne tıklama ve yeni sekmeyi açma
  const [sepet] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('div.p-card-wrppr.with-campaign-view.add-to-bs-card').first().click(),
  ]);
  console.log("İlk ürün yeni sekmede açıldı.");

  await sepet.waitForLoadState();

  // Anladım butonuna tıklama
  await sepet.getByRole('button', { name: 'Anladım' }).waitFor();
  await sepet.getByRole('button', { name: 'Anladım' }).click();
  console.log("Anladım butonuna tıklandı.");

  // Fiyat kaydetme ve sepete ekleme
  const fiyat = await sepet.locator('.product-price-container .prc-dsc').innerText();
  const fiyatBir = parseInt(fiyat.replace(".", "").replace(" TL", ""));
  await sepet.getByRole('button', { name: 'Sepete Ekle' }).click();
  console.log("İlk ürün sepete eklendi. Fiyat:", fiyatBir);

  // Sepete gitme
  await page.waitForTimeout(1000);
  await sepet.getByRole('link', { name: '  Sepetim' }).click();
  console.log("Sepetim sayfasına gidildi.");

  // Anladım butonuna tıklama (tekrar)
  const anladimButonu = sepet.getByRole('button', { name: 'Anladım' });
  if (await anladimButonu.isVisible()) {
    await anladimButonu.click();
  }

  // Sepette ürün var mı kontrolü
  const elemanVarMi = await sepet.locator('.pb-merchant-group').count() > 0;
  console.log("Sepette ürün var mı?", elemanVarMi);

  // Fiyat kontrolü
  const fiyatTamHali = await sepet.locator('.pb-summary-total-price').innerText();
  const sadeceFiyat = fiyatTamHali.replace("Toplam", "").trim();
  const numericValue = parseInt(sadeceFiyat.replace(".", "").replace(" TL", ""));
  console.log("Mağaza fiyatı:", fiyatBir, "Sepet fiyatı:", numericValue);
  expect(fiyatBir).toBe(numericValue);

  // Kargo ücreti kontrolü
  const kargoText = await sepet.locator('li:has-text("Kargo Toplam") strong').innerText();
  const kargoUcret = parseFloat(kargoText.replace(/[^\d,]/g, '').replace(',', '.'));
  console.log("Kargo ücreti:", kargoUcret);

  // Anladım butonuna tıklama (tekrar)
  await sepet.waitForLoadState();
  const anladimButonu2 = sepet.getByRole('button', { name: 'Anladım' });
  if (await anladimButonu2.isVisible()) {
    await anladimButonu2.click();
  }

  // Ürün adedi arttırma ve azaltma
  await expect(sepet.getByRole('textbox', { name: 'Ürün adedi' })).toHaveValue('1');
  await sepet.getByRole('button', { name: 'Ürün adedi arttırma' }).click();
  await expect(sepet.getByRole('textbox', { name: 'Ürün adedi' })).toHaveValue('2');
  await sepet.getByRole('button', { name: 'Ürün adedi azaltma' }).click();
  await expect(sepet.getByRole('textbox', { name: 'Ürün adedi' })).toHaveValue('1');
  console.log("Ürün adedi artırılıp azaltıldı, tekrar 1'e döndü.");

  // İkinci ürünü seçme ve yeni sekme açma
  const [ikinciUrun] = await Promise.all([
    context.waitForEvent('page'),
    page.locator('div.p-card-wrppr.with-campaign-view.add-to-bs-card').nth(1).click(),
  ]);
  await ikinciUrun.waitForLoadState();
  console.log("İkinci ürün yeni sekmede açıldı.");

  // Sepete ekleme ve sepet sayfasına gitme
  await ikinciUrun.getByRole('button', { name: 'Sepete Ekle' }).click();
  await ikinciUrun.getByRole('link', { name: '  Sepetim' }).click();
  console.log("İkinci ürün sepete eklendi.");

  // İkinci ürün fiyatını alma
  const urunFiyati2 = await ikinciUrun.locator('.pb-basket-item-price').first().innerText();
  const urunFiyati2Numeric = parseInt(urunFiyati2.replace(".", "").replace(" TL", "").trim());
  console.log("İkinci ürün fiyatı:", urunFiyati2Numeric);

  // Toplam fiyatı kontrol etme
  const toplamFiyat = await ikinciUrun.locator('.pb-summary-total-price').innerText();
  const numerictoplamFiyat = parseInt(toplamFiyat.replace("Toplam", "").replace(" TL", "").replace(".", "").trim());
  const toplamFiyatHesaplanan = urunFiyati2Numeric + fiyatBir;
  console.log("Toplam fiyat hesaplanan:", toplamFiyatHesaplanan, "Sepetteki toplam:", numerictoplamFiyat);
  expect(toplamFiyatHesaplanan).toBe(numerictoplamFiyat);

  // Anladım butonuna tıklama (tekrar)
  const anladimButonu3 = ikinciUrun.getByRole('button', { name: 'Anladım' });
  if (await anladimButonu3.isVisible()) {
    await anladimButonu3.click();
  }

  // Ürünleri sepetten çıkarma
  await ikinciUrun.getByRole('button', { name: 'Ürünü sepetten çıkartma' }).first().click();
  await page.waitForTimeout(2000);
  await ikinciUrun.getByRole('button', { name: 'Ürünü sepetten çıkartma' }).click();
  console.log("Ürünler sepetten çıkarıldı.");

  // Sepette ürün kalıp kalmadığını kontrol etme
  const elemanVarMi2 = await sepet.locator('.pb-merchant-group').count() > 0;
  console.log("Sepette ürün var mı (son kontrol)?", elemanVarMi2);
});
