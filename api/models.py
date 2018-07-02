# stdlib
from datetime import timedelta, date

# django core
from django.db import models
from django.core.exceptions import ValidationError
# --------- Models -------------

# This model will provide created, modified fields


class TimeStampedModel(models.Model):
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class OldTasksManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter()


class TaskQuerySet(models.QuerySet):
    def old(self):
        print(date.today()-timedelta(days=30))
        return self.filter(is_is_deletedtrashed=True, due_date__lte=date.today()-timedelta(days=30))

    def today(self):
        return self.filter(due_date=date.today())

    def this_week(self):
        start_week = self.due_date - timedelta(date.weekday())
        end_week = start_week + timedelta(7)
        return self.filter(due_date__range=[start_week, end_week])

    def next_week(self):
        start_week = self.due_date - timedelta(date.weekday()) + timedelta(7)
        end_week = start_week + timedelta(7)
        return self.filter(due_date__range=[start_week, end_week])

    def over_due(self):
        return self.filter(due_date__gte=date.today())

    def not_trashed(self):
        return self.filter(is_deleted=False)


# class TaskManager(models.Manager):
#     def get_queryset(self):
#         return TaskQuerySet(self.model, using=self._db)

#     def old_tasks(self):
#         return self.get_queryset().old()

#     def today_tasks(self):
#         return self.get_queryset().today_()

#     def this_week_tasks(self):
#         return self.get_queryset().this_week()

#     def next_week_tasks(self):
#         return self.get_queryset().next_week()

#     def overdue_tasks(self):
#         return self.get_queryset().over_due()


class AbstractTask(TimeStampedModel):
    title = models.CharField(
        max_length=50, null=False, blank=False)

    due_date = models.DateField(blank=True, null=True)

    is_task_completed = models.BooleanField(
        default=False)  # completed or pending

    is_deleted = models.BooleanField(default=False)  # soft deleted

    objects = models.Manager()
    manager = TaskQuerySet.as_manager()

    def task_status(self):
        if self.is_task_completed:
            return "completed"
        else:
            return "pending"

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['due_date']
        abstract = True


class Task(AbstractTask):
    title = models.CharField(
        max_length=50, unique=True, null=False, blank=False)

    @property
    def has_sub_tasks(self):
        return self.sub_tasks().count() > 0

    def sub_tasks(self):
        return SubTask.objects.filter(parent_task=self.pk)


class SubTask(AbstractTask):
    parent_task = models.ForeignKey(
        Task, related_name='task', on_delete=models.CASCADE)

    def save(self, *args, **kwargs):
        if not Task.objects.get(pk=self.parent_task.pk).due_date:
            super(SubTask, self).save(*args, **kwargs)
        elif self.due_date <= Task.objects.get(pk=self.parent_task.pk).due_date:
            super(SubTask, self).save(*args, **kwargs)
        else:
            raise ValidationError(
                'Date must be earlier than or equal to parent task due date')

    class Meta:
        unique_together = ('title', 'parent_task',)
