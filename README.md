# 🎅 Santa's Magical Wish List

A festive, AI-powered Christmas wish list application where users can create their holiday wishes, get verdicts from Santa, and receive personalized career coaching from a unique panel of advisors! Built with Next.js and FastAPI, featuring beautiful animations and an enchanting parchment-scroll design.

🔗 **[Live Demo](https://frontend-wish-list-673ooocgl-micaela-8510s-projects.vercel.app/)**

![Santa's Wish List](frontend-wish-list/public/images/cool-santa.png)

## ✨ Features

### 🎁 Wish List Management
- Add Christmas wishes to your personalized list
- Each wish receives Santa's verdict: **NICE** or **NAUGHTY**
- Submit your complete list for Santa's final review
- Get a personalized response from Santa based on all your wishes

### 🎄 Christmas Spirit Meter
- Watch your Christmas spirit grow as you add wishes
- Fill the meter to 100% by adding 10 wishes
- Unlock magical themes as you build Christmas spirit!

### 🎨 Unlockable Themes
- **Classic** (0%) - Traditional Christmas green
- **Snow** (20%) - Icy blue winter wonderland
- **Aurora** (60%) - Magical purple northern lights
- **Gingerbread** (100%) - Warm amber cookie theme

### 🎁 Santa's Gift: Career Coaching Panel
After completing your wish list, unlock a special gift from Santa!
- **Upload your CV** (PDF format) for personalized career advice
- Get wisdom from **three unique AI advisors**:
  - 😇 **Angel Coach** - Kind, encouraging, sees the best in you
  - 😈 **Devil Coach** - Brutally honest, gives tough love
  - 🎅 **Santa's Wisdom** - Focuses on work-life balance and finding purpose

### 🌨️ Visual Effects
- Animated falling snowflakes
- Elegant parchment scroll design
- Festive color schemes and smooth transitions
- Dynamic theme colors that change the entire UI

## 🛠️ Tech Stack

### Frontend
- **Next.js 16** - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Styling
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons

### Backend
- **FastAPI** - Python web framework
- **OpenAI API** - GPT-4o-mini for AI chat and career coaching
- **PyPDF2** - PDF text extraction for CV uploads
- **Pydantic** - Data validation

### Deployment
- **Vercel** - Serverless deployment for both frontend and backend

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend-wish-list
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file with your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. Run the development server:
   ```bash
   uvicorn api.index:app --reload --port 8000
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend-wish-list
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file with the backend URL:
   ```env
   NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
AIE-Challenge-Wish_List/
├── backend-wish-list/
│   ├── api/
│   │   └── index.py          # FastAPI application & routes
│   ├── requirements.txt      # Python dependencies
│   ├── pyproject.toml        # Python project config
│   └── vercel.json           # Vercel deployment config
│
├── frontend-wish-list/
│   ├── app/
│   │   ├── page.tsx          # Main application page
│   │   ├── layout.tsx        # Root layout
│   │   └── globals.css       # Global styles
│   ├── components/
│   │   └── ui/               # Reusable UI components
│   ├── public/
│   │   └── images/           # Static images
│   └── package.json          # Node dependencies
│
└── README.md
```

## 🔧 API Endpoints

### `GET /`
Health check endpoint.

**Response:**
```json
{ "status": "ok" }
```

### `POST /api/chat`
Send a message to Santa or get wish list verdict.

**Request:**
```json
{
  "message": "What's on your wish list, Santa?",
  "character": "nicholas",
  "cv_context": ""
}
```

**Response:**
```json
{ "reply": "Ho ho ho! I wish for peace and joy for all children around the world! 🎅" }
```

### `POST /api/upload-cv`
Upload a PDF resume/CV for text extraction.

**Request:** `multipart/form-data` with PDF file

**Response:**
```json
{ "cv_text": "Extracted text from the PDF..." }
```

### `POST /api/chat/panel`
Get responses from all three career coaching personas at once.

**Request:**
```json
{
  "message": "What should I focus on in my career?",
  "cv_context": "Extracted CV text here..."
}
```

**Response:**
```json
{
  "angel": "✨ I can see so many wonderful strengths in your background...",
  "devil": "🔥 Let's cut to the chase - here's what you need to work on...",
  "nicholas": "Ho ho ho! Remember, a fulfilling career is about more than just success..."
}
```

## 🎨 Customization

### Adding New Themes
Themes are defined in the `themeColors` object in `page.tsx`. Each theme includes:
- `primary` - Main background color
- `primaryHover` - Hover state color
- `secondary` - Secondary accent color
- `border` - Border color
- `accent` - Text accent color

### Modifying Personas
Edit the `PERSONAS` dictionary in `backend-wish-list/api/index.py` to customize how each advisor responds:
- **nicholas** - Santa's wise, warm guidance
- **angel** - Encouraging, supportive feedback
- **devil** - Direct, tough-love approach

## 🚢 Deployment

### Vercel Deployment

Both frontend and backend are configured for Vercel deployment.

1. Connect your repository to Vercel
2. Set environment variables:
   - Backend: `OPENAI_API_KEY`
   - Frontend: `NEXT_PUBLIC_BACKEND_URL` (your deployed backend URL)
3. Deploy!

## 📝 License

This project is open source and available under the MIT License.

## 🎄 Happy Holidays!

May your wishes come true this Christmas season! 🎅✨
