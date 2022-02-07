import { form_error, info_block, info_container, interface_container, interface_form } from './constants.js';

const pad = (n, z = 2) => ('00' + n).slice(-z);

// Формат времени
export const msToTime = (s) => {
  return pad(s / 3.6e6 | 0) + ':' + pad((s % 3.6e6) / 6e4 | 0) + ':' + pad((s % 6e4) / 1000 | 0);
}

// Сериализовать форму
export const serialize_form = (form) => Array.from(new FormData(form)).map((x) => ({ [x[0]]: x[1] })).reduce((a, b) => ({ ...a, ...b }));

// Показать \ Обновить информацию о получении ссылок
export const update_dump_info = ({
  file_links_count,
  requests_count
}) => {
  document.getElementById(info_block).style.display = 'flex';
  document.getElementById(info_block).innerHTML = `
    <div>
      <h4 class="stage">Этап: Сбор ссылок</h4>
    </div>
    <div>
      <p>Ссылок получено:</p>
      <p>${file_links_count}</p>
    </div>
    <div>
      <p>Запросов:</p>
      <p>${requests_count}</p>
    </div>
    <div>
      <h5 class="next_stage">Следующий этап: Вычисление размера файлов</h5>
    </div>
  `;
}

// Показать \ Обновить информацию о получении размера файлов
export const update_files_size_info = ({
  bytes,
  left_files
}) => {
  document.getElementById(info_block).style.display = 'flex';
  document.getElementById(info_block).innerHTML = `
    <div>
      <h4 class="stage">Этап: Вычисление размера файлов</h4>
    </div>
    <div>
      <p>Размер файлов (мб):</p>
      <p class="megabytes">${bytes}</p>
    </div>
    <div>
      <p>Осталось обработать файлов:</p>
      <p>${left_files}</p>
    </div>
    <div>
      <h5 class="next_stage">Следующий этап: Скачивание файлов</h5>
    </div>
  `;
}

// Показать \ Обновить информацию о скачивании файлов
export const update_download_info = ({
  requests_success,
  requests_error,
  requests_total,
  requests_left,
  left_bytes,
  downloaded_bytes
}) => {
  document.getElementById(info_block).style.display = 'flex';
  document.getElementById(info_block).innerHTML = `
    <div>
      <h4 class="stage">Этап: Скачивание файлов</h4>
    </div>
    <div>
      <p>Удачных запросов:</p>
      <p>${requests_success}</p>
    </div>
    <div>
      <p>Неудачных запросов:</p>
      <p>${requests_error}</p>
    </div>
    <div>
      <p>Всего запросов:</p>
      <p>${requests_total}</p>
    </div>
    <div>
      <p>Запросов осталось:</p>
      <p>${requests_left}</p>
    </div>
    <div>
      <p>Осталось скачать (мб):</p>
      <p class="megabytes">${left_bytes}</p>
    </div>
    <div>
      <p>Скачано (мб):</p>
      <p class="megabytes">${downloaded_bytes}</p>
    </div>
    <div>
      <h5 class="next_stage">Следующий этап: {__}</h5>
    </div>
  `;
}

// Показать \ Обновить информацию о архивации
export const update_archive_info = ({
  total,
  processed,
  filename,
  path
}) => {
  document.getElementById(info_block).style.display = 'flex';
  document.getElementById(info_block).innerHTML = `
    <div>
      <h4 class="stage">Этап: Архивирование файлов</h4>
    </div>
    <div>
      <p>Всего файлов (мб):</p>
      <p class="megabytes">${total}</p>
    </div>
    <div>
      <p>В процессе (мб):</p>
      <p class="megabytes">${processed}</p>
    </div>
    <div>
      <p>Имя архива:</p>
      <p>${filename}</p>
    </div>
    <div>
      <p>Путь до архива:</p>
      <p>${path}</p>
    </div>
    <div>
      <h5 class="next_stage">Следующий этап: Завершение</h5>
    </div>
  `;
}

// Показать блок завершения работы скрипта
export const show_finish_block = ({
  time,
  message,
  details,
  data: {
    files_count,
    files_size,
    files_path,
    archive
  }
}) => {
  document.getElementById(info_block).style.display = 'flex';
  document.getElementById(info_block).innerHTML = `
    <div>
      <h4 class="stage">Этап: Финал</h4>
    </div>
    <div>
      <p>Скрипт работал:</p>
      <p>${msToTime(time)}</p>
    </div>
    <div class="message">
      <p>${message}</p>
    </div>
    <div class="message">
      <p>${details}</p>
    </div>
    <div>
      <p>Файлов скачано:</p>
      <p>${files_count}</p>
    </div>
    <div>
      <p>Размер файлов (мб):</p>
      <p class="megabytes">${files_size}</p>
    </div>
    <div>
      <p>Путь до файлов:</p>
      <p>${files_path}</p>
    </div>
    ${archive ? `
      <div>
        <p>Путь до архива:</p>
        <p>${archive.path}</p>
      </div>
      <div>
        <p>Имя архива:</p>
        <p>${archive.filename}</p>
      </div>
      ` : ``
    }
    <div>
      <button id="finish_button">Завершить</button>
    </div>
  `;

  document.getElementById('finish_button').addEventListener('click', (event) => {
    hide_error();
    document.getElementById(info_block).style.display = 'none';
    document.getElementById(info_container).style.display = 'none';
    document.getElementById(interface_container).style.display = 'flex';
    document.getElementById(interface_form).style.display = 'flex';
  });
}

// Показать \ Обновить ошибку
export const show_error = message => {
  document.getElementById(info_block).style.display = 'none';
  document.getElementById(info_container).style.display = 'none';
  document.getElementById(interface_form).style.display = 'flex';
  document.getElementById(interface_container).style.display = 'flex';
  document.getElementById(form_error).style.display = 'block';
  document.getElementById(form_error).innerHTML = `<p>${message}</p>`;
}

export const hide_error = () => {
  document.getElementById(info_block).style.display = 'none';
  document.getElementById(info_container).style.display = 'none';
  document.getElementById(interface_form).style.display = 'flex';
  document.getElementById(interface_container).style.display = 'flex';
  document.getElementById(form_error).innerHTML = ``;
  document.getElementById(form_error).style.display = 'none';
}