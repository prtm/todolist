#stdlib
from datetime import date

# core django
from django.shortcuts import render
from django.core.paginator import EmptyPage, PageNotAnInteger, Paginator
# project
from .models import Task, SubTask
# Create your views here.



# handle task request with pagination
def task(request):

    task_list = Task.manager.not_trashed()
    print(task_list)
    paginator = Paginator(task_list, 10)  # Show 10 tasks per page
    page = request.GET.get('page')
    try:
        tasks = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer deliver the first page
        tasks = paginator.page(1)
    except EmptyPage:
        # If page is out of range deliver last page of results
        tasks = paginator.page(paginator.num_pages)

    return render(request, 'api/task.html', {'page': page, 'Tasks': tasks, 'today_date':date.today()})

# handle sub task request with pagination
def sub_task(request, id):

    sub_task_list = SubTask.manager.not_trashed().filter(parent_task=id)
    paginator = Paginator(sub_task_list, 10)  # Show 10 tasks per page
    page = request.GET.get('page')
    try:
        sub_tasks = paginator.page(page)
    except PageNotAnInteger:
        # If page is not an integer deliver the first page
        sub_tasks = paginator.page(1)
    except EmptyPage:
        # If page is out of range deliver last page of results
        sub_tasks = paginator.page(paginator.num_pages)

    return render(request, 'api/sub_task.html', {'page': page, 'SubTasks': sub_tasks, 'task': Task.objects.get(pk=id)})
