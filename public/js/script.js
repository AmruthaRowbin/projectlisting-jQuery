$(document).ready(function () {
  let currentPage = 1;
  let currentSort = 'recent';

  // Fetch and display projects
  function loadProjects(page = 1, sort = 'recent') {
    $.ajax({
      url: `/api/projects?page=${page}&sort=${sort}`,
      method: 'GET',
      success: function (response) {
        const { projects, currentPage, totalPages } = response;

        // Populate the table
        let html = '';
        projects.forEach(proj => {
          html += `<tr>
            <td>${proj.title}</td>
            <td>${proj.username}</td>
            <td>${proj.category_name || '—'}</td>
          </tr>`;
        });
        $('#projectTable tbody').html(html);

        // Render pagination
        let paginationHtml = '';
        for (let i = 1; i <= totalPages; i++) {
          paginationHtml += `<button class="page-btn" data-page="${i}">${i}</button>`;
        }
        $('#pagination').html(paginationHtml);

        // Highlight active page
        $(`button[data-page=${currentPage}]`).css({ background: 'black', color: 'white' });
      }
    });
  }

  // Initial load
  loadProjects(currentPage, currentSort);

  // On pagination click
  $(document).on('click', '.page-btn', function () {
    const selectedPage = $(this).data('page');
    currentPage = selectedPage;
    loadProjects(currentPage, currentSort);
  });

  // On sort dropdown change
  $('#sortOptions').on('change', function () {
    currentSort = $(this).val();
    currentPage = 1; // Reset to first page
    loadProjects(currentPage, currentSort);
  });
});
