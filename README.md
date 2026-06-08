# Deployable Website

這是一個可直接部署的靜態網站資料夾，不需要安裝套件或編譯。

## 資料夾結構

```text
deployable-website/
├─ index.html
├─ assets/
│  ├─ css/
│  │  └─ styles.css
│  ├─ js/
│  │  └─ main.js
│  └─ images/
└─ README.md
```

## 如何預覽

直接用瀏覽器開啟 `index.html` 即可。

## 如何部署

### Netlify

1. 登入 Netlify。
2. 選擇 Add new site。
3. 將整個 `deployable-website` 資料夾拖曳上傳。
4. 發布完成後即可取得網址。

### Vercel

1. 建立新專案。
2. 上傳或連接包含 `deployable-website` 的 Git repository。
3. Framework Preset 選擇 Other。
4. Output Directory 指向 `deployable-website`。

### GitHub Pages

1. 將 `deployable-website` 內的檔案放到 repository。
2. 到 Settings > Pages。
3. Source 選擇部署分支。
4. 儲存後等待 GitHub 產生網址。

## 建議替換內容

- `index.html`：修改品牌名稱、服務文字、案例與聯絡資訊。
- `assets/css/styles.css`：修改顏色、字體與版面。
- `assets/images/`：放入自己的圖片，再於 HTML 或 CSS 中引用。
- `assets/js/main.js`：日後可串接正式表單 API。
