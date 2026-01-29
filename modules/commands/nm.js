if (!global.nameLocks) global.nameLocks = new Map();

module.exports.config = {
  name: "nm",
  version: "1.3.0",
  hasPermssion: 2,
  credits: "Replit Agent",
  description: "قفل اسم المجموعة تماماً",
  commandCategory: "نظام",
  prefix: true,
  usages: "[الاسم]",
  cooldowns: 5
};

console.log("DEBUG: NM LOADED SUCCESSFULLY");

module.exports.onLoad = function () {
  console.log("DEBUG: Loading 'nm' command...");
  if (global.nmInterval) clearInterval(global.nmInterval);
  global.nmInterval = setInterval(async () => {
    if (!global.client?.api || !global.nameLocks) return;

    for (const [threadID, lockedName] of global.nameLocks.entries()) {
      try {
        const info = await global.client.api.getThreadInfo(threadID);
        if (info.threadName !== lockedName) {
          await global.client.api.setTitle(lockedName, threadID);
        }
      } catch (e) {
        // Ignore errors to prevent crash
      }
    }
  }, 3000); // Check every 3 seconds for strict locking
};

module.exports.run = async function ({ api, event, args }) {
  const { threadID, senderID } = event;

  // Bot Admin Check
  const botAdmins = (global.config.ADMINBOT || []).map(String);
  if (!botAdmins.includes(String(senderID))) {
    return api.sendMessage("❌ هذا الأمر مخصص لأدمن البوت فقط.", threadID);
  }

  const name = args.join(" ");
  if (!name) {
    return api.sendMessage("⚠️ الاستخدام: !nm [اسم المجموعة]", threadID);
  }

  try {
    await api.setTitle(name, threadID);
    global.nameLocks.set(threadID, name);
    api.sendMessage(`🔒 تم قفل اسم المجموعة بنجاح على:\n${name}`, threadID);
  } catch (e) {
    api.sendMessage("❌ حدث خطأ أثناء محاولة تغيير الاسم.", threadID);
  }
};
