const fs = require("fs");

if (!global.engineIntervals) global.engineIntervals = new Map();

module.exports.config = {
  name: "محرك",
  version: "1.0.0",
  hasPermssion: 2,
  credits: "Replit Agent",
  description: "يرسل رسالة كل 30 ثانية من ملف txt.txt (تفعيل/ايقاف)",
  commandCategory: "نظام",
  prefix: true,
  usages: "[تفعيل/ايقاف]",
  cooldowns: 5
};

console.log("DEBUG: Loaded 'محرك' command config.");

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID } = event;
  const action = args[0]?.toLowerCase();

  // Admin Check
  const admins = (global.config.ADMINBOT || []).map(String);
  if (!admins.includes(String(senderID))) {
    return api.sendMessage("❌ هذا الأمر مخصص لأدمن البوت فقط.", threadID);
  }

  // إيقاف المحرك
  if (action === "ايقاف" || action === "off" || action === "stop") {
    if (global.engineIntervals.has(threadID)) {
      clearInterval(global.engineIntervals.get(threadID));
      global.engineIntervals.delete(threadID);
      return api.sendMessage("⏹️ تم إيقاف المحرك في هذه المجموعة.", threadID);
    } else {
      return api.sendMessage("⚠️ المحرك ليس قيد التشغيل في هذه المجموعة.", threadID);
    }
  }

  // تفعيل المحرك
  if (action === "تفعيل" || action === "on" || action === "start") {
    if (global.engineIntervals.has(threadID)) {
      return api.sendMessage("⚠️ المحرك قيد التشغيل بالفعل.", threadID);
    }

    api.sendMessage("🚀 تم تفعيل المحرك بنجاح (رسالة كل 30 ثانية).", threadID);

    const interval = setInterval(() => {
      try {
        const message = fs.readFileSync("txt.txt", "utf8").trim();
        if (message) {
          api.sendMessage(message, threadID);
        }
      } catch (err) {
        console.error("ERROR reading txt.txt:", err);
        api.sendMessage("❌ حدث خطأ أثناء قراءة ملف txt.txt", threadID);
      }
    }, 30 * 1000);

    global.engineIntervals.set(threadID, interval);
    return;
  }

  // استخدام خاطئ
  return api.sendMessage("⚠️ الاستخدام: !محرك [تفعيل/ايقاف]", threadID);
};
