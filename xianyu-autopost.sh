#!/bin/bash
# Xianyu Auto-Post via iPhone Mirroring
# Posts 5 AI service items to Xianyu (闲鱼)

ITEMS=(
  "AI帮你写周报 工作汇报 一键生成 专业职场风|6.6|AI一键生成专业周报！输入工作要点，30秒出稿。4种风格可选：专业汇报/成果导向/极简高效/技术风。流程：拍下→发要点→5分钟出稿→不满意免费重做。体验价¥6.6/次，多份优惠。"
  "AI会议纪要生成 会议记录整理 标准化纪要|6.6|AI会议纪要整理，会议记录一键转标准纪要。自动提取议题、讨论要点、决议、待办事项。支持语音转文字后的凌乱文本。流程：拍下→发记录→10分钟出稿→不满意免费改。体验价¥6.6/次。"
  "AI简历优化 CV润色 大厂PM视角 STAR法则|9.9|大厂PM视角+AI双重优化你的简历。STAR法则重写每条经历，突出量化成果和数据亮点。流程：拍下→发简历→30分钟出优化版→可改1次。体验价¥9.9/次。"
  "AI翻译润色 中英互译 工作邮件 文档翻译|8.8|AI翻译润色，中英互译+专业润色。工作邮件/技术文档/简历英文版，不只翻译还帮你润色语言。流程：拍下→发内容→10分钟出稿→不满意免费改。¥8.8/千字以内。"
  "AI数据分析 Excel解读 经营分析 数据报告|12.8|AI数据解读，上传数据自动分析趋势生成洞察报告，可直接放PPT。适用周报数据/经营分析/销售复盘/用户数据。流程：拍下→发数据→20分钟出报告。¥12.8/次。"
)

echo "Starting Xianyu auto-post..."
echo "Make sure iPhone Mirroring is connected and showing the Home Screen"
echo ""

# Helper function to click and type
click() { cliclick "c:$1,$2"; sleep 1; }
type_text() { cliclick "t:$1"; sleep 0.3; }

# Step 1: Go to Home Screen
echo "1. Going to Home Screen..."
osascript -e 'tell application "iPhone Mirroring" to activate'
sleep 2
cliclick kd:cmd t:1 ku:cmd
sleep 2

# Step 2: Tap on Xianyu app (assumes it's on first home screen page)
echo "2. Opening Xianyu app..."
# Xianyu app icon is typically in the top-left area of the home screen
# Let's try a few common positions
click 200 300
sleep 3

# Step 3: Tap "卖闲置" (Sell) button
echo "3. Looking for Sell button..."
click 200 500
sleep 2

for i in "${!ITEMS[@]}"; do
  IFS='|' read -r title price desc <<< "${ITEMS[$i]}"
  num=$((i + 1))
  echo ""
  echo "=== Posting item $num/5: $title ==="
  
  # Tap "发布" or "卖闲置" to start new item
  click 350 700
  sleep 2
  
  # Type title - need to tap the title field first
  click 200 300
  sleep 1
  type_text "$title"
  sleep 1
  
  # Tap price field
  click 200 450
  sleep 1
  type_text "$price"
  sleep 1
  
  # Tap description field
  click 200 550
  sleep 1
  type_text "$desc"
  sleep 1
  
  # Tap publish/submit button
  echo "  Submitting..."
  click 350 750
  sleep 3
  
  echo "  Item $num posted!"
done

echo ""
echo "=== ALL 5 ITEMS POSTED! ==="
