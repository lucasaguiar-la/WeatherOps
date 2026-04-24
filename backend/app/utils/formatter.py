from math import ceil, floor


class Formatter:
    @staticmethod
    def format_temperature(number: float) -> int | None:
        number_string = str(number)

        if not number_string:
            return None

        try:
            parts = number_string.split('.')
            decimal_part = int(parts[1])
        except (IndexError, ValueError):
            decimal_part = 0

        if decimal_part < 50:
            return floor(number)

        return ceil(number)
