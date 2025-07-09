from django.core.management.base import BaseCommand
from base.models import Page

class Command(BaseCommand):
    help = 'Seed initial pages into the Page table'

    def handle(self, *args, **kwargs):
        pages = [
            "Products List",
            "Marketing List",
            "Order List",
            "Media Plans",
            "Offer Pricing SKUs",
            "Clients",
            "Suppliers",
            "Customer Support",
            "Sales Reports",
            "Finance & Accounting",
        ]

        for name in pages:
            obj, created = Page.objects.get_or_create(name=name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created: {name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Already exists: {name}'))

        self.stdout.write(self.style.SUCCESS("Seeding completed."))
