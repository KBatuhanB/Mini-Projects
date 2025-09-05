const { test, expect } = require('@playwright/test');

test.describe('X (Twitter) login ve DM gönderme testi', () => {

  test('Login ve yeni mesaj gönderme akışı', async ({ page }) => {

    // Sayfayı aç
    await page.goto('https://x.com/');

    // Giriş yap butonu görünür olmalı ve tıklanabilir olmalı
    const girisYap = page.getByTestId('loginButton');
    await expect(girisYap).toBeVisible();
    await girisYap.click();

    // E-posta kutusuna yaz ve doğrula
    const eposta = page.getByRole('textbox', { name: 'Phone, email, or username' });
    const myEposta = 'kelamibatushan@gmail.com';
    await eposta.fill(myEposta);
    await expect(eposta).toHaveValue(myEposta); 
    await page.keyboard.press('Enter');

    // Kullanıcı adını yaz ve doğrula
    const username = page.getByTestId('ocfEnterTextTextInput');
    const myUserName = 'BolukbasK9539';
    await username.fill(myUserName);
    await expect(username).toHaveValue(myUserName); 
    await page.keyboard.press('Enter');

    // Şifreyi gir ve kontrol et
    const sifre = page.getByRole('textbox', { name: 'Password Reveal password' });
    const mySifre = 'kbl79587081';
    await sifre.fill(mySifre);
    await expect(sifre).toHaveValue(mySifre);
    await page.keyboard.press('Enter');

    // DM sekmesi görünür olmalı ve tıklanmalı
    const dmButton = page.getByTestId('AppTabBar_DirectMessage_Link');
    await expect(dmButton).toBeVisible();
    await dmButton.click();

    // Mesaj sayısını kontrol et
    await page.getByTestId('conversation').waitFor();
    const mesajSayisi = await page.getByTestId('conversation').count();
    console.log(`Toplam mesaj sayısı (önce): ${mesajSayisi}`);

    // Yeni mesaj başlat
    await page.getByTestId('NewDM_Button').click();

    // Kişi ara ve input değeri doğru mu kontrol et
    const searchInput = page.getByTestId('searchPeople');
    await searchInput.fill('Alprn_sp');
    await expect(searchInput).toHaveValue('Alprn_sp');

    // Kişi listelendi mi? (bekleme güvenlik için)
    await page.waitForTimeout(1000);
    await page.getByTestId('TypeaheadUser').click();

    // "İleri" butonu görünürse devam et
    const ilerleButton = page.getByTestId('nextButton');
    await expect(ilerleButton).toBeVisible();
    await ilerleButton.click();

    // "Maybe later" varsa kapat
    await page.getByRole('button', { name: 'Maybe later' }).click();

    // Yeni mesaj sayısını al ve karşılaştır
    const yeniMesajSayisi = await page.getByTestId('conversation').count();
    console.log(`Toplam mesaj sayısı (sonra): ${yeniMesajSayisi}`);

    // Test assertion: yeni mesaj sayısı artmış olmalı
    expect(yeniMesajSayisi).toBeGreaterThan(mesajSayisi);

  });

});