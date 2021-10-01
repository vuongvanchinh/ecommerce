from django.db import models
from django.db.models import F, Max, Q
from datetime import datetime


class PublishableModel(models.Model):
    publication_date = models.DateField(blank=True, null=True)
    is_published = models.BooleanField(default=False)

    # objects = PublishedQuerySet.as_manager()

    class Meta:
        abstract = True

    @property
    def is_visible(self):
        return self.is_published and (
            self.publication_date is None
            or self.publication_date <= datetime.date.today()
        )