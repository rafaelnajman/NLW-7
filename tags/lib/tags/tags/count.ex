defmodule Tags.Tags.Count do
  @moduledoc false
  alias Tags.Messages.Get

  def call do
    Get.today_messages()
    |> Task.async_stream(fn message -> count_words(message.message) end)
    |> Enum.reduce(%{}, fn elem, acc -> sum_value(elem, acc) end)
  end

  defp count_words(message) do
    message
    |> String.split(" ")
    |> Enum.frequencies()
  end

  defp sum_value({:ok, map1}, map2) do
    Map.merge(map1, map2, fn _key, value1, value2 ->
      value1 + value2
    end)
  end
end
