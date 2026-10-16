// =====================================================
// Модуль кастомных модальных окон
// =====================================================

const DIALOG_ICONS = {
  info:    { icon: 'ℹ️', color: '#70B2AF', title: 'Информация' },
  success: { icon: '✅', color: '#2c8f5a', title: 'Успешно' },
  warning: { icon: '⚠️', color: '#c98700', title: 'Внимание' },
  error:   { icon: '❌', color: '#d92d2d', title: 'Ошибка' },
  confirm: { icon: '❓', color: '#70B2AF', title: 'Подтверждение' }
};

function showDialog(type, message, options = {}) {
  return new Promise((resolve) => {
    const cfg = DIALOG_ICONS[type] || DIALOG_ICONS.info;
    const title = options.title || cfg.title;
    const isConfirm = type === 'confirm';
    const confirmText = options.confirmText || (isConfirm ? 'OK' : 'Понятно');
    const cancelText = options.cancelText || 'Отмена';

    const old = document.getElementById('dialogOverlay');
    if (old) old.remove();

    const overlay = document.createElement('div');
    overlay.id = 'dialogOverlay';
    overlay.className = 'dialog-overlay';
    overlay.innerHTML = `
      <div class="dialog-box" style="border-top-color: ${cfg.color};">
        <div class="dialog-icon" style="background: ${cfg.color}20; color: ${cfg.color};">
          ${cfg.icon}
        </div>
        <h3 class="dialog-title">${title}</h3>
        <div class="dialog-message">${message}</div>
        <div class="dialog-actions">
          ${isConfirm ? `<button class="dialog-btn dialog-btn-cancel" data-action="cancel">${cancelText}</button>` : ''}
          <button class="dialog-btn dialog-btn-confirm" data-action="ok" style="background: ${cfg.color};">${confirmText}</button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('show'));

    const close = (result) => {
      overlay.classList.remove('show');
      setTimeout(() => { overlay.remove(); resolve(result); }, 200);
    };

    overlay.querySelector('[data-action="ok"]').addEventListener('click', () => close(true));
    const cancelBtn = overlay.querySelector('[data-action="cancel"]');
    if (cancelBtn) cancelBtn.addEventListener('click', () => close(false));

    const keyHandler = (e) => {
      if (e.key === 'Escape') { document.removeEventListener('keydown', keyHandler); close(false); }
      if (e.key === 'Enter')  { document.removeEventListener('keydown', keyHandler); close(true); }
    };
    document.addEventListener('keydown', keyHandler);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close(false);
    });
  });
}

function dialogInfo(msg, opts)    { return showDialog('info', msg, opts); }
function dialogSuccess(msg, opts) { return showDialog('success', msg, opts); }
function dialogWarning(msg, opts) { return showDialog('warning', msg, opts); }
function dialogError(msg, opts)   { return showDialog('error', msg, opts); }
function dialogConfirm(msg, opts) { return showDialog('confirm', msg, opts); }